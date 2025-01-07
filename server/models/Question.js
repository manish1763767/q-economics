const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('multiple-choice', 'true-false', 'short-answer'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Microeconomics', 'Macroeconomics', 'Statistics', 'Economic History'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    allowNull: false
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidOptions(value) {
        if (this.type === 'multiple-choice' && (!Array.isArray(value) || value.length < 2)) {
          throw new Error('Multiple choice questions must have at least 2 options');
        }
      }
    }
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: function() {
      return this.type === 'short-answer';
    }
  },
  explanation: {
    type: DataTypes.TEXT
  },
  hint: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  successRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['category', 'difficulty']
    },
    {
      fields: ['tags']
    },
    {
      fields: ['text'],
      type: 'FULLTEXT'
    }
  ]
});

module.exports = Question;
