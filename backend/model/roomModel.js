const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    name: String,
    location: String,
    capacity: Number,
    equipment: [String],
    image: String
});
module.exports = mongoose.model('Room', roomSchema, 'rooms');
