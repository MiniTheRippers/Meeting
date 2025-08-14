const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const generateOtp = require('../utils/generateOtp');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const cors = require('cors');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.otp = undefined;

    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: {
            user,
        },
    });
};
//signup  สมัครสมาชิก
exports.signup = catchAsync(async (req, res, next) => {
    const {email, password, passwordConfirm, username, role} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            status: 'fail',
            message: 'อีเมลนี้ได้ลงทะเบียนไว้แล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ',
            error: 'DUPLICATE_EMAIL'
        });
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = await User.create({
        username,
        email,
        password,
        passwordConfirm,
        otp,
        otpExpires,
        role: role || 'user',
        is_admin: role === 'admin',
    });
    
    try {
        await sendEmail({
            email: newUser.email,
            subject: 'OTP for email verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to WEBDEV WARRIORS!</h1>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="color: #666; margin-bottom: 15px;">Your verification code is:</p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007bff; border: 2px dashed #007bff;">
                            ${otp}
                        </div>
                    </div>
                    <p style="color: #666; margin-bottom: 10px;">This code will expire in 24 hours.</p>
                    <p style="color: #666; margin-bottom: 20px;">If you didn't request this verification code, please ignore this email.</p>
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
                    </div>
                </div>
            `,
        });

        createSendToken(newUser, 201, res, "ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการลงทะเบียน");
    } catch (error) {
        await User.findByIdAndDelete(newUser._id);
        console.error('Signup error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่อีกครั้ง',
            error: 'EMAIL_SEND_FAILED'
        });
    }
});
// verification การตรวจสอบ
exports.verifyAccount = catchAsync(async(req, res, next) => {
    if (!req.body) {
        return next(new AppError("ไม่พบข้อมูลที่ส่งมา", 400));
    }

    const { otp } = req.body;

    if (!otp) {
        return next(new AppError("กรุณาระบุรหัส OTP", 400));
    }

    const user = req.user;

    if (!user) {
        return next(new AppError("ไม่พบข้อมูลผู้ใช้", 401));
    }

    if (user.otp !== otp) {
        return next(new AppError("รหัส OTP ไม่ถูกต้อง", 400));
    }

    if (Date.now() > user.otpExpires) {
        return next(new AppError("รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่", 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res, "ยืนยันอีเมลเรียบร้อยแล้ว");
});

//  resendOTP  ส่งOTP อีกครั้ง
exports.resendOTP = catchAsync(async(req,res,next)=>{
    const {email} = req.user;

    if(!email) {
        return next(new AppError("Email is required to resend otp",400))
    }

    const user = await User.findOne({email})

    if(!user){
        return next(new AppError("User not Found",400))
    }

    if(user.isVerified){
        return next(new AppError("This account is already verified",400))
    }

    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });
    
    try {
        await sendEmail({
            email: user.email,
            subject:"Resend otp for email verification",
            html:`<h1>Your New otp is :${newOtp}</h1>`,
        })

        res.status(200).json({
            status:"success",
            message:"A new otp has sent to your email",
        })
    } catch (error) {
        user.otp=undefined;
        user.otpExpires=undefined;
        await user.save({validateBeforeSave:false})
        return next(new AppError("There is an error sending the email ! Please try again",500))
    }
})
//login เข้าสู่ระบบ
exports.login = catchAsync(async(req,res,next)=>{
    const  {email,password} = req.body;

    if(!email || !password){
        return  next(new AppError("Please provide email and password",400))
    }

    const user = await User.findOne({email}).select("+password role is_admin");

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError("Incorrect Email or password",401))
    }

    createSendToken(user,200,res,"Login Successful");
})
//  logout ออกจากระบบ
exports.logout = catchAsync(async(req,res,next)=>{
    res.cookie("token","loggedout",{
        expires:new Date(Date.now() + 10 * 1000),
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
    });

    res.status(200).json({
        status:"success",
        message:"Logged out successfully",
    })
})
//forgetPassword    ลืมรหัสผ่าน
exports.forgetPassword = catchAsync(async(req,res,next)=>{
    const {email} = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return next(new AppError("No user found",404));
    }

    const otp = generateOtp();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 300000;

    await user.save({validateBeforeSave:false});

    try{
        await sendEmail({
            email:user.email,
            subject:"Your password Reset Otp (valid for  5 min)",
            html:`<h1>Your password reset Otp:${otp}</h1>`,
        })

        res.status(200).json({
            status:"success",
            message:"Password reset otp is send to your email",
        })
    } catch (error){
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save ({ validateBeforeSave:false });

        return next(new AppError("There was an  error sending the email. Please try again later")) 
    }
})
//resetPassword รีเซ็ตรหัสผ่าน
exports.resetPassword = catchAsync(async(req, res, next)=>{
    const {email, otp, password, passwordConfirm}= req.body;

    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordOTPExpires:{$gt:Date.now()}
    })

    if (!user) return next(new AppError("No user found",400));
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    createSendToken(user,200,res,"Password reset successdfully")
})

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

const corsHandler = cors(corsOptions);

exports.corsHandler = corsHandler;
