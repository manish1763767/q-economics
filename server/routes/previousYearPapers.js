const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const PreviousYearPaper = require('../models/PreviousYearPaper');
const Question = require('../models/Question');
const UserProgress = require('../models/UserProgress');
const multer = require('multer');
const path = require('path');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/papers');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Get all papers with filters
router.get('/', async (req, res) => {
  try {
    const {
      year,
      examType,
      subject,
      difficulty,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};
    if (year) where.year = year;
    if (examType) where.examType = examType;
    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const papers = await PreviousYearPaper.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['year', 'DESC']],
    });

    res.json({
      papers: papers.rows,
      total: papers.count,
      totalPages: Math.ceil(papers.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get paper by ID with questions
router.get('/:id', auth, async (req, res) => {
  try {
    const paper = await PreviousYearPaper.findByPk(req.params.id, {
      include: [{
        model: Question,
        attributes: ['id', 'questionText', 'questionType', 'options', 'marks'],
      }],
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json(paper);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload new paper (admin only)
router.post('/', adminAuth, upload.single('pdf'), async (req, res) => {
  try {
    const {
      title,
      year,
      examType,
      subject,
      description,
      difficulty,
      duration,
      totalMarks,
      questions,
    } = req.body;

    const paper = await PreviousYearPaper.create({
      title,
      year,
      examType,
      subject,
      description,
      difficulty,
      duration,
      totalMarks,
      pdfUrl: req.file ? `/uploads/papers/${req.file.filename}` : null,
    });

    if (questions) {
      const questionsData = JSON.parse(questions);
      const questionsWithPaperId = questionsData.map(q => ({
        ...q,
        previousYearPaperId: paper.id,
      }));
      await Question.bulkCreate(questionsWithPaperId);
    }

    res.status(201).json(paper);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit paper attempt
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const paperId = req.params.id;

    const paper = await PreviousYearPaper.findByPk(paperId, {
      include: [{
        model: Question,
        attributes: ['id', 'correctAnswer', 'marks', 'questionType', 'topic'],
      }],
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // Calculate score and update progress
    let totalScore = 0;
    const topicProgress = {};

    paper.Questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = compareAnswers(userAnswer, question.correctAnswer, question.questionType);
      
      if (isCorrect) {
        totalScore += question.marks;
      }

      // Track progress by topic
      if (!topicProgress[question.topic]) {
        topicProgress[question.topic] = {
          correct: 0,
          total: 0,
        };
      }
      topicProgress[question.topic].total++;
      if (isCorrect) {
        topicProgress[question.topic].correct++;
      }
    });

    // Update user progress for each topic
    for (const [topic, progress] of Object.entries(topicProgress)) {
      await UserProgress.findOrCreate({
        where: {
          userId: req.user.id,
          subject: paper.subject,
          topic,
        },
      }).then(async ([userProgress]) => {
        userProgress.totalAttempts++;
        userProgress.totalQuestions += progress.total;
        userProgress.correctAnswers += progress.correct;
        userProgress.averageScore = (userProgress.correctAnswers / userProgress.totalQuestions) * 100;
        userProgress.lastAttemptDate = new Date();

        // Update strength level
        if (userProgress.averageScore >= 80) {
          userProgress.strengthLevel = 'Excellent';
        } else if (userProgress.averageScore >= 60) {
          userProgress.strengthLevel = 'Good';
        } else if (userProgress.averageScore >= 40) {
          userProgress.strengthLevel = 'Improving';
        } else {
          userProgress.strengthLevel = 'Weak';
        }

        await userProgress.save();
      });
    }

    res.json({
      score: totalScore,
      totalMarks: paper.totalMarks,
      percentage: (totalScore / paper.totalMarks) * 100,
      topicProgress,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get paper statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const paperId = req.params.id;
    const stats = await UserPaperAttempt.findAll({
      where: { paperId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('score')), 'averageScore'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAttempts'],
        [sequelize.fn('MAX', sequelize.col('score')), 'highestScore'],
      ],
    });

    res.json(stats[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
