const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// POST /api/documents
router.post('/', async (req, res) => {
    console.log('Received:', req.body); // เพิ่มบรรทัดนี้
    try {
        const doc = new Document(req.body);
        await doc.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/documents
router.get('/', async (req, res) => {
    try {
        const docs = await Document.find().sort({ createdAt: -1 });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;