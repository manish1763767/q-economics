const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PreviousYearPaper = sequelize.define('PreviousYearPaper', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  examType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  totalMarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  hasAnswerKey: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

PreviousYearPaper.associate = (models) => {
  PreviousYearPaper.hasMany(models.Question);
  PreviousYearPaper.hasMany(models.UserPaperAttempt);
};

module.exports = PreviousYearPaper;
