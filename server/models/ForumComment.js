const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForumComment = sequelize.define('ForumComment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ForumPosts',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ForumComments',
      key: 'id',
    },
  },
});

// Associations will be set up in index.js
ForumComment.associate = (models) => {
  ForumComment.belongsTo(models.User);
  ForumComment.belongsTo(models.ForumPost);
  ForumComment.belongsTo(models.ForumComment, { as: 'parent' });
  ForumComment.hasMany(models.ForumComment, { as: 'replies', foreignKey: 'parentId' });
};

module.exports = ForumComment;
