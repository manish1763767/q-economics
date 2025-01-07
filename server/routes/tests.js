const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Test = require('../models/Test');
const Question = require('../models/Question');

// Get all tests (with optional filters)
router.get('/', auth, async (req, res) => {
  try {
    const { subject, difficulty, search } = req.query;
    const where = {};

    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const tests = await Test.findAll({
      where,
      attributes: ['id', 'title', 'subject', 'difficulty', 'duration', 'totalQuestions'],
    });

    res.json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get test by ID (with questions)
router.get('/:id', auth, async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id, {
      include: [{
        model: Question,
        attributes: ['id', 'questionText', 'questionType', 'options', 'marks'],
      }],
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new test (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      difficulty,
      duration,
      totalQuestions,
      questions,
    } = req.body;

    // Create test
    const test = await Test.create({
      title,
      subject,
      description,
      difficulty,
      duration,
      totalQuestions,
    });

    // Create questions
    if (questions && questions.length > 0) {
      const questionsWithTestId = questions.map(q => ({
        ...q,
        testId: test.id,
      }));
      await Question.bulkCreate(questionsWithTestId);
    }

    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit test answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const testId = req.params.id;

    // Get test questions with correct answers
    const questions = await Question.findAll({
      where: { testId },
      attributes: ['id', 'correctAnswer', 'marks', 'questionType'],
    });

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = compareAnswers(userAnswer, question.correctAnswer, question.questionType);
      
      maxScore += question.marks;
      if (isCorrect) {
        totalScore += question.marks;
      }

      results.push({
        questionId: question.id,
        correct: isCorrect,
        marks: isCorrect ? question.marks : 0,
      });
    });

    const percentage = (totalScore / maxScore) * 100;

    // Save test result
    // TODO: Add TestResult model and save results

    res.json({
      score: totalScore,
      maxScore,
      percentage,
      results,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to compare answers
function compareAnswers(userAnswer, correctAnswer, questionType) {
  if (questionType === 'MCQ') {
    return userAnswer === correctAnswer;
  } else if (questionType === 'MultiSelect') {
    if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
      return false;
    }
    return (
      userAnswer.length === correctAnswer.length &&
      userAnswer.every(answer => correctAnswer.includes(answer))
    );
  } else if (questionType === 'Detailed') {
    // For detailed answers, we'll need manual grading
    return null;
  }
  return false;
}

module.exports = router;
