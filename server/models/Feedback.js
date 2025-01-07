const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('bug', 'feature', 'content', 'general'),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('test', 'forum', 'analytics', 'ui', 'other'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open',
  },
  resolution: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  screenshots: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  browserInfo: {
    type: DataTypes.JSONB,
  },
  adminResponse: {
    type: DataTypes.TEXT,
  },
  resolvedAt: {
    type: DataTypes.DATE,
  },
});

Feedback.associate = (models) => {
  Feedback.belongsTo(models.User);
  Feedback.hasMany(models.FeedbackComment);
};

module.exports = Feedback;
