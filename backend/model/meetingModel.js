const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: String,
    startDate: String,
    startTime: String,
    endTime: String,
    participants: Array,
    file: String
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
