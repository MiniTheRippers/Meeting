const express = require('express');
const router = express.Router();

// Mock ข้อมูลในหน่วยความจำ (ถ้ายังไม่เชื่อมต่อฐานข้อมูล)
let requests = [];

// POST /api/meeting-requests
router.post('/', (req, res) => {
    requests.push(req.body);
    res.status(201).json({ message: "บันทึกข้อมูลสำเร็จ", data: req.body });
});

// GET /api/meeting-requests
router.get('/', (req, res) => {
    res.json(requests);
});

module.exports = router;
