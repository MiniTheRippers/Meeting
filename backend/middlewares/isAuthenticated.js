const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');

const isAuthenticated = catchAsync(async (req, res, next) => {
    try {
        // 1) Getting token and check if it exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('คุณยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบก่อน', 401));
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('ผู้ใช้ที่เกี่ยวข้องกับ token นี้ไม่มีอยู่ในระบบ', 401));
        }

        // 4) Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token หมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่', 401));
        }
        return next(error);
    }
});

module.exports = isAuthenticated;