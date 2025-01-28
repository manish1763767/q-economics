const express = require('express');
const { adminAuth } = require('../middleware/auth');
const { MockTest } = require('../models');

const router = express.Router();

// Get all tests
router.get('/mock-tests', async (req, res) => {
    try {
        const tests = await MockTest.findAll();
        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new test (admin only)
router.post('/mock-tests', adminAuth, async (req, res) => {
    try {
        const test = await MockTest.create(req.body);
        res.status(201).json(test);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update test (admin only)
router.put('/mock-tests/:id', adminAuth, async (req, res) => {
    try {
        const test = await MockTest.findByPk(req.params.id);
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }
        await test.update(req.body);
        res.json(test);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete test (admin only)
router.delete('/mock-tests/:id', adminAuth, async (req, res) => {
    try {
        const test = await MockTest.findByPk(req.params.id);
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }
        await test.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
