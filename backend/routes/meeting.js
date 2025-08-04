const express = require('express');
const multer = require('multer');
const router = express.Router();
const Meeting = require('../model/meetingModel');
const MeetingRoom = require('../model/roomModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/api/meeting', upload.single('file'), async (req, res) => {
    try {
        const { title, startDate, startTime, endTime, participants } = req.body;
        // participants จะเป็น string ต้องแปลงกลับเป็น array
        const participantsArr = JSON.parse(participants);

        const meeting = new Meeting({
            title,
            startDate,
            startTime,
            endTime,
            participants: participantsArr,
            file: req.file.filename
        });

        await meeting.save();
        res.json({ success: true, meeting });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const meetings = await Meeting.find();
    res.json(meetings);
});

router.post('/room', async (req, res) => {
    try {
        const { name, location, capacity, equipment, image } = req.body;
        const newRoom = await MeetingRoom.create({ name, location, capacity, equipment, image });
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
