const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeedbackComment = sequelize.define('FeedbackComment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  feedbackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Feedbacks',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isAdminResponse: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

FeedbackComment.associate = (models) => {
  FeedbackComment.belongsTo(models.User);
  FeedbackComment.belongsTo(models.Feedback);
};

module.exports = FeedbackComment;
