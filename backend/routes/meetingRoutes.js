// backend/routes/meetingRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Meeting = require('../model/meetingModel');

const upload = multer({ dest: 'uploads/' });

// GET /api/meeting
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ createdAt: -1 });
        res.json(meetings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/meeting
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, startDate, startTime, endTime, participants } = req.body;
        const file = req.file ? req.file.filename : null;
        // participants ที่ส่งมาจาก frontend เป็น string ต้อง parse เป็น array
        const participantsArr = JSON.parse(participants);

        const meeting = new Meeting({
            title,
            startDate,
            startTime,
            endTime,
            participants: participantsArr,
            file
        });
        await meeting.save();
        res.json({ success: true, meeting });
    } catch (err) {
        console.error(err); // สำคัญ! จะได้เห็น error ใน terminal
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
