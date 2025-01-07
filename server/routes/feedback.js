const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const FeedbackComment = require('../models/FeedbackComment');
const { Op } = require('sequelize');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/feedback');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Submit new feedback
router.post('/', auth, upload.array('screenshots', 5), async (req, res) => {
  try {
    const {
      type,
      category,
      title,
      description,
      priority,
      browserInfo,
    } = req.body;

    const screenshots = req.files
      ? req.files.map(file => `/uploads/feedback/${file.filename}`)
      : [];

    const feedback = await Feedback.create({
      userId: req.user.id,
      type,
      category,
      title,
      description,
      priority,
      screenshots,
      browserInfo: JSON.parse(browserInfo || '{}'),
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all feedback (admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const {
      status,
      priority,
      type,
      category,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const feedback = await Feedback.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      feedback: feedback.rows,
      total: feedback.count,
      totalPages: Math.ceil(feedback.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's feedback
router.get('/my', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: FeedbackComment,
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        },
      ],
    });

    res.json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update feedback status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, resolution, adminResponse } = req.body;
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.status = status;
    if (resolution) feedback.resolution = resolution;
    if (adminResponse) feedback.adminResponse = adminResponse;
    if (status === 'resolved' || status === 'closed') {
      feedback.resolvedAt = new Date();
    }

    await feedback.save();
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add comment to feedback
router.post('/:id/comments', auth, upload.array('attachments', 3), async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const attachments = req.files
      ? req.files.map(file => `/uploads/feedback/${file.filename}`)
      : [];

    const comment = await FeedbackComment.create({
      userId: req.user.id,
      feedbackId: feedback.id,
      content: req.body.content,
      isAdminResponse: req.user.role === 'admin',
      attachments,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get feedback statistics (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalCount,
      openCount,
      resolvedCount,
      avgResolutionTime,
      categoryStats,
      priorityStats,
    ] = await Promise.all([
      Feedback.count(),
      Feedback.count({ where: { status: 'open' } }),
      Feedback.count({ where: { status: 'resolved' } }),
      Feedback.findAll({
        where: {
          status: 'resolved',
          resolvedAt: { [Op.not]: null },
        },
        attributes: [
          [
            sequelize.fn(
              'AVG',
              sequelize.fn('EXTRACT', sequelize.literal('EPOCH FROM ("resolvedAt" - "createdAt")'))
            ),
            'avgResolutionTime',
          ],
        ],
      }),
      Feedback.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: 'category',
      }),
      Feedback.findAll({
        attributes: [
          'priority',
          [sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: 'priority',
      }),
    ]);

    res.json({
      totalCount,
      openCount,
      resolvedCount,
      avgResolutionTime: avgResolutionTime[0].get('avgResolutionTime'),
      categoryStats,
      priorityStats,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
