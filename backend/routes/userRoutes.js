const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // เพิ่ม JWT
const User = require('../models/User'); 

// ควรย้ายไปเก็บใน environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// เก็บ OTP ชั่วคราว (ควรใช้ DB หรือ Redis ใน production)
const otpStore = {};

// ฟังก์ชันสร้าง JWT
const createToken = (id, isAdmin) => {
    return jwt.sign({ id, is_admin: isAdmin }, JWT_SECRET, {
        expiresIn: '1h', // กำหนดเวลาหมดอายุของ Token
    });
};

// =========================================================
// === Route: Forgot Password (Request OTP)
// =========================================================
router.post('/forget-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: EMAIL_USER, pass: EMAIL_PASS }
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'รหัส OTP สำหรับการรีเซ็ตรหัสผ่าน',
            html: `<p>รหัส OTP ของคุณคือ: <strong>${otp}</strong></p><p>รหัสนี้จะหมดอายุภายใน 10 นาที</p>`
        };

        await transporter.sendMail(mailOptions);
        otpStore[email] = {
            otp,
            expires: Date.now() + 10 * 60 * 1000 // OTP หมดอายุใน 10 นาที
        };
        res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

// =========================================================
// === Route: Reset Password
// =========================================================
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, otp } = req.body;
    if (!email || !newPassword || !otp) {
        return res.status(400).json({ message: 'Email, newPassword, and OTP are required' });
    }

    const storedOtpData = otpStore[email];
    if (storedOtpData && storedOtpData.otp.toString() === otp.toString() && storedOtpData.expires > Date.now()) {
        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();
            
            delete otpStore[email];
            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ message: 'Error resetting password', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
});

// =========================================================
// === Route: Login
// =========================================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        // สร้าง JWT
        const token = createToken(user._id, user.is_admin);
        
        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                is_admin: user.is_admin
            },
            token 
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// =========================================================
// === Route: Signup
// =========================================================
router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'Email, password, and username are required' });
    }
    try {
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(409).json({ message: 'Email already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
            is_admin: false // ตั้งค่าเป็น false โดยค่าเริ่มต้น
        });
        
        const token = createToken(newUser._id, newUser.is_admin);
        
        res.status(201).json({ 
            message: 'Signup successful', 
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                is_admin: newUser.is_admin
            },
            token 
        });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up', error: error.message });
    }
});

// =========================================================
// === Route: Get All Users
// =========================================================
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); 
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;