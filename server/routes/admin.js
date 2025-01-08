const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Test = require('../models/Test');
const Question = require('../models/Question');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

// Admin functionalities
// Route to manage users
router.get('/users', isAdmin, async (req, res) => {
    // Logic to get all users
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

// Route to add a new user
router.post('/users', isAdmin, async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await User.create({ email, password, role: 'student' }); // Default role is student
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(400).json({ error: 'Failed to add user. Please try again.' });
    }
});

// Route to manage tests
router.get('/tests', isAdmin, async (req, res) => {
    // Logic to get all tests
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

// Update user role
router.patch('/users/:id/role', isAdmin, async (req, res) => {
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
router.delete('/users/:id', isAdmin, async (req, res) => {
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
router.get('/tests/stats', isAdmin, async (req, res) => {
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

// Route to register a new user
router.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }
        const newUser = await User.create({ email, password, role: 'student' }); // Default role is student
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user. Please try again.' });
    }
});

// Route to add a new test
router.post('/tests', isAdmin, async (req, res) => {
    const { title, subject, difficulty, totalQuestions } = req.body;
    try {
        const newTest = await Test.create({ title, subject, difficulty, totalQuestions });
        res.status(201).json(newTest);
    } catch (error) {
        console.error('Error adding test:', error);
        res.status(500).json({ error: 'Failed to add test. Please try again.' });
    }
});

// Route to edit an existing test
router.patch('/tests/:id', isAdmin, async (req, res) => {
    const { title, subject, difficulty, totalQuestions } = req.body;
    try {
        const test = await Test.findByPk(req.params.id);
        if (!test) {
            return res.status(404).json({ error: 'Test not found.' });
        }
        test.title = title || test.title;
        test.subject = subject || test.subject;
        test.difficulty = difficulty || test.difficulty;
        test.totalQuestions = totalQuestions || test.totalQuestions;
        await test.save();
        res.json(test);
    } catch (error) {
        console.error('Error editing test:', error);
        res.status(500).json({ error: 'Failed to edit test. Please try again.' });
    }
});

// Route to edit test details
router.put('/tests/:id/details', isAdmin, async (req, res) => {
    const { title, subject, difficulty, totalQuestions } = req.body;
    try {
        const test = await Test.findByPk(req.params.id);
        if (!test) {
            return res.status(404).json({ error: 'Test not found.' });
        }
        test.title = title;
        test.subject = subject;
        test.difficulty = difficulty;
        test.totalQuestions = totalQuestions;
        await test.save();
        res.json(test);
    } catch (error) {
        console.error('Error updating test details:', error);
        res.status(500).json({ error: 'Failed to update test details. Please try again.' });
    }
});

// Route to add a question to a test
router.post('/tests/:id/questions', isAdmin, async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;
    try {
        const test = await Test.findByPk(req.params.id);
        if (!test) {
            return res.status(404).json({ error: 'Test not found.' });
        }
        const question = await Question.create({ testId: test.id, questionText, options, correctAnswer });
        res.status(201).json(question);
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Failed to add question. Please try again.' });
    }
});

// Route to edit a question
router.patch('/tests/:id/questions/:questionId', isAdmin, async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;
    try {
        const question = await Question.findByPk(req.params.questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found.' });
        }
        question.questionText = questionText || question.questionText;
        question.options = options || question.options;
        question.correctAnswer = correctAnswer || question.correctAnswer;
        await question.save();
        res.json(question);
    } catch (error) {
        console.error('Error editing question:', error);
        res.status(500).json({ error: 'Failed to edit question. Please try again.' });
    }
});

// Route to delete a question
router.delete('/tests/:id/questions/:questionId', isAdmin, async (req, res) => {
    try {
        const question = await Question.findByPk(req.params.questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found.' });
        }
        await question.destroy();
        res.json({ message: 'Question deleted successfully.' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question. Please try again.' });
    }
});

// Route to get available tests
router.get('/tests', async (req, res) => {
    try {
        const tests = await Test.findAll();
        res.json(tests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Failed to fetch tests. Please try again.' });
    }
});

// Route to get specific test details
router.get('/tests/:id', async (req, res) => {
    try {
        const test = await Test.findByPk(req.params.id, {
            include: [{ model: Question }],
        });
        if (!test) {
            return res.status(404).json({ error: 'Test not found.' });
        }
        res.json(test);
    } catch (error) {
        console.error('Error fetching test details:', error);
        res.status(500).json({ error: 'Failed to fetch test details. Please try again.' });
    }
});

// Route to submit answers for a test
router.post('/tests/:id/submit', async (req, res) => {
    const { userId, answers } = req.body;
    try {
        // Logic to save the user's answers and calculate results
        // This can involve saving to a results table or similar
        // For now, we will just return the submitted answers
        res.json({ userId, testId: req.params.id, answers });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ error: 'Failed to submit answers. Please try again.' });
    }
});

// Route to get user test results
router.get('/users/:userId/results', async (req, res) => {
    try {
        // Logic to fetch results for the user
        // This can involve querying a results table
        const results = []; // Placeholder for actual results
        res.json(results);
    } catch (error) {
        console.error('Error fetching user results:', error);
        res.status(500).json({ error: 'Failed to fetch results. Please try again.' });
    }
});

module.exports = router;
