const express = require('express');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                products: []
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get single product
router.get('/:productId', (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                product: {}
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Create new product
router.post('/', (req, res) => {
    try {
        res.status(201).json({
            status: 'success',
            data: {
                product: req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update product
router.patch('/:productId', (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                product: req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete product
router.delete('/:productId', (req, res) => {
    try {
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router; 