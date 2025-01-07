const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const { sendNotificationEmail } = require('../utils/email');

// Get all posts with pagination and filters
router.get('/posts', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sort = 'newest',
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (tag) where.tags = { [Op.contains]: [tag] };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const order = [];
    switch (sort) {
      case 'newest':
        order.push(['createdAt', 'DESC']);
        break;
      case 'popular':
        order.push(['views', 'DESC']);
        break;
      case 'unanswered':
        where.isResolved = false;
        break;
    }

    const posts = await ForumPost.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: ForumComment,
          separate: true,
          attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'commentCount']],
        },
      ],
    });

    res.json({
      posts: posts.rows,
      total: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new post
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await ForumPost.create({
      userId: req.user.id,
      title,
      content,
      category,
      tags,
    });

    // Notify followers or moderators
    const moderators = await User.findAll({ where: { role: 'admin' } });
    for (const moderator of moderators) {
      await sendNotificationEmail({
        to: moderator.email,
        subject: 'New Forum Post',
        template: 'newForumPost',
        data: {
          postTitle: title,
          posterName: `${req.user.firstName} ${req.user.lastName}`,
          postUrl: `/forum/posts/${post.id}`,
        },
      });
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single post with comments
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: ForumComment,
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName'],
            },
            {
              model: ForumComment,
              as: 'replies',
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add comment
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.id;

    const post = await ForumPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await ForumComment.create({
      userId: req.user.id,
      postId,
      content,
      parentId,
    });

    // Notify post owner of new comment
    if (post.userId !== req.user.id) {
      const postOwner = await User.findByPk(post.userId);
      await sendNotificationEmail({
        to: postOwner.email,
        subject: 'New Comment on Your Post',
        template: 'newComment',
        data: {
          postTitle: post.title,
          commenterName: `${req.user.firstName} ${req.user.lastName}`,
          postUrl: `/forum/posts/${post.id}`,
        },
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark comment as answer
router.patch('/comments/:id/mark-answer', auth, async (req, res) => {
  try {
    const comment = await ForumComment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const post = await ForumPost.findByPk(comment.postId);
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    comment.isAnswer = true;
    post.isResolved = true;
    
    await Promise.all([comment.save(), post.save()]);

    res.json({ message: 'Comment marked as answer' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
