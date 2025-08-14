const express = require('express');
const router = express.Router();
const Room = require('../model/roomModel');
const MeetingRoom = require('../model/meetingModel');


// GET all rooms
router.get('/', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

// POST add room
router.post('/', async (req, res) => {
    const newRoom = await Room.create({
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
        equipment: req.body.equipment,
        // ...field อื่นๆ
    });
    res.json(newRoom);
});

// PUT edit room
router.put('/:id', async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
});

// DELETE room
router.delete('/:id', async (req, res) => {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// POST /api/rooms
router.post('/api/rooms', async (req, res) => {
    try {
        const { name, location, capacity, equipment, image } = req.body;
        const room = new MeetingRoom({ name, location, capacity, equipment, image });
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/rooms
router.get('/api/rooms', async (req, res) => {
    // ตัวอย่าง mock ข้อมูล
    // const rooms = await Room.find(); // ถ้าเชื่อมต่อฐานข้อมูล
    const rooms = [
        { _id: "1", name: "BLack", location: "20", capacity: 10, equipment: ["โทรทัศน์", "ไมค์"], image: "" }
    ];
    res.json(rooms);
});

module.exports = router;
