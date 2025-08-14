const mongoose = require('mongoose');
const { trim } = require('validator');
const validator = require('validator');
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please tell us your username!'],
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Please tell us your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    },

    otpExpires: {
        type: Date,
        default: null,
    },
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    is_admin: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true,
});

    userSchema.pre("save",async function (next){
        if(!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password,12)
        this.passwordConfirm =undefined;

        next();
    })

    userSchema.methods.correctPassword = async function (password,userPassword){
        return await bcrypt.compare(password,userPassword);
    }

const User = mongoose.model('User', userSchema);
module.exports = User;