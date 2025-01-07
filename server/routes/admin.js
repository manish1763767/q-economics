const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Test = require('../models/Test');
const Question = require('../models/Question');

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeTests = await Test.count({ where: { isActive: true } });
    const totalQuestions = await Question.count();

    // Get recent activity
    const recentTests = await Test.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'createdAt'],
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
    });

    res.json({
      stats: {
        totalUsers,
        activeTests,
        totalQuestions,
      },
      recentActivity: {
        tests: recentTests,
        users: recentUsers,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user role
router.patch('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get test statistics
router.get('/tests/stats', adminAuth, async (req, res) => {
  try {
    const tests = await Test.findAll({
      attributes: [
        'id',
        'title',
        'subject',
        'difficulty',
        'totalQuestions',
        'createdAt',
      ],
      include: [
        {
          model: Question,
          attributes: ['id'],
        },
      ],
    });

    const testStats = tests.map(test => ({
      id: test.id,
      title: test.title,
      subject: test.subject,
      difficulty: test.difficulty,
      questionCount: test.Questions.length,
      createdAt: test.createdAt,
    }));

    res.json(testStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
