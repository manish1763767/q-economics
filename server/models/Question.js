const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tests',
      key: 'id',
    },
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM('MCQ', 'MultiSelect', 'Detailed'),
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true, // null for detailed questions
  },
  correctAnswer: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
  },
  marks: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
});

module.exports = Question;
