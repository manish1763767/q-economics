const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProgress = sequelize.define('UserProgress', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  averageScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  timeSpent: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0,
  },
  lastAttemptDate: {
    type: DataTypes.DATE,
  },
  strengthLevel: {
    type: DataTypes.ENUM('Weak', 'Improving', 'Good', 'Excellent'),
    defaultValue: 'Improving',
  },
});

UserProgress.associate = (models) => {
  UserProgress.belongsTo(models.User);
};

module.exports = UserProgress;
