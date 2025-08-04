const mongoose = require('mongoose');

const userRowSchema = new mongoose.Schema({
    name: String,
    position: String,
    role: String,
});

const documentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    date: String,
    title: String,
    location: String,
    agenda1: String,
    agenda2: String,
    agenda3: String,
    agenda4: String,
    agenda5: String,
    agenda6: String,
    leaders: [userRowSchema],
    absents: [userRowSchema],
    participants: [userRowSchema],
    createdAt: String,
});

module.exports = mongoose.model('Document', documentSchema);