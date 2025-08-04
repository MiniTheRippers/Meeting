const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouters'); // เปลี่ยน './routes/userRoutes' เป็น path ที่ถูกต้องไปยังไฟล์ userRoutes ของคุณ
const globalErrorHandler = require('./controller/errorController'); // สมมติว่าคุณมี error controller
const AppError = require('./utils/appError'); // สมมติว่าคุณมี AppError class
const User = require('./model/userModel'); // import User model
const authRoutes = require('./routes/auth');
const roomRouter = require('./routes/roomRoutes');
const upload = require('./routes/upload');
const meetingRoutes = require('./routes/meeting');
<<<<<<< HEAD
const mongoose = require('mongoose');
const documentRoutes = require('./routes/document');
=======
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c

const app = express();

// Logging middleware
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: 'http://localhost:3000', // หรือ '*' ถ้าต้องการให้ทุก origin เข้าถึงได้
        credentials: true,
    })
);

<<<<<<< HEAD
// เชื่อมต่อฐานข้อมูล MongoDB
mongoose.connect('mongodb://localhost:27017/meetingdb', { useNewUrlParser: true, useUnifiedTopology: true });

=======
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
// สร้าง route สำหรับค้นหา users
app.get('/api/users', async (req, res) => {
    try {
        const search = req.query.search || '';
        // ค้นหาจาก name หรือ email ที่มี search string (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
        const users = await User.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Routes
app.use("/api/v1/users", userRouter);
app.use('/api', authRoutes);
app.use('/api/rooms', roomRouter);
app.use('/api/upload', upload);
app.use('/api/meeting', meetingRoutes);
<<<<<<< HEAD
app.use('/api/documents', documentRoutes);
=======
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
app.use(require('./routes/meeting'));
// Handle undefined routes
app.use((req, res, next) => {
    next(new AppError(`ไม่พบ URL: ${req.originalUrl} บนเซิร์ฟเวอร์นี้!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

<<<<<<< HEAD
app.listen(8000, () => {
    console.log('Server running on port 8000');
});

=======
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
module.exports = app;