const express = require('express');
const User = require('../models/User');
const Test = require('../models/Test');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get all tests
router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.findAll();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tests' });
  }
});

// Create a new test
router.post('/tests', async (req, res) => {
  const { name, description, questions } = req.body;
  try {
    const test = await Test.create({ name, description, questions });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Update a test by ID
router.put('/tests/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, questions } = req.body;
  try {
    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    test.name = name;
    test.description = description;
    test.questions = questions;
    await test.save();
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update test' });
  }
});

// Delete a test by ID
router.delete('/tests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    await test.destroy();
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

module.exports = router;
