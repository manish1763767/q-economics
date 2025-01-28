const express = require('express');
const jwt = require('jsonwebtoken');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await User.create({ email, password, name });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await user.validatePassword(password))) {
            throw new Error('Invalid login credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Get current user profile
router.get('/me', auth, (req, res) => {
    res.json(req.user);
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'password'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates');
        }

        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin Routes

// Create admin user (protected)
router.post('/admin', adminAuth, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await User.create({ 
            email, 
            password, 
            name,
            role: 'admin'
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'name', 'role', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
