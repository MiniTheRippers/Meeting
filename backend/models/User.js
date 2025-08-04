const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    // เพิ่ม field อื่น ๆ ตามต้องการ
});

module.exports = mongoose.model('User', userSchema);