// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

// Route สำหรับดูข้อมูลผู้ใช้ทั้งหมด (เฉพาะ Admin)
router.get('/', verifyToken, checkAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route สำหรับแก้ไขรหัสผ่านผู้ใช้ (เฉพาะ Admin)
router.put('/password/:id', verifyToken, checkAdmin, async (req, res) => {
    // Logic การแก้ไขรหัสผ่าน
});

// เพิ่ม routes อื่นๆ ที่ต้องการ
// ...

module.exports = router;