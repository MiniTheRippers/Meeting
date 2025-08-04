const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User'); // ต้องมีโมเดล User


const bcrypt = require('bcryptjs');
// เก็บ OTP ชั่วคราว (ควรใช้ DB หรือ Redis ใน production)
const otpStore = {};

// ขอรหัส OTP และส่งเข้า email
router.post('/forget-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // ตรวจสอบว่า email มีอยู่ในระบบหรือไม่
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // สร้าง OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // สร้าง transporter สำหรับส่งอีเมล
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        otpStore[email] = otp; // เก็บ OTP ชั่วคราว
        res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error });
    }
});

// เปลี่ยนรหัสผ่านด้วย OTP
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, otp } = req.body;
    if (!email || !newPassword || !otp) {
        return res.status(400).json({ message: 'Email, newPassword, and OTP are required' });
    }

    if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });
            // hash password ก่อนบันทึก
            user.password = bcrypt.hashSync(newPassword, 12);
            await user.save();
            delete otpStore[email];
            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error resetting password', error });
        }
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

// เข้าสู่ระบบ
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        // ใช้ bcrypt เปรียบเทียบรหัสผ่าน
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Email, password, and username are required' });
    }
    try {
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(409).json({ message: 'Email already exists' });
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
            username
        });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // ไม่ส่ง password กลับ
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});



module.exports = router;