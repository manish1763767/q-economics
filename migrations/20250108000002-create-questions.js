'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('multiple-choice', 'true-false', 'short-answer'),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Microeconomics', 'Macroeconomics', 'Statistics', 'Economic History'),
        allowNull: false
      },
      difficulty: {
        type: Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false
      },
      marks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      correctAnswer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      explanation: {
        type: Sequelize.TEXT
      },
      hint: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      testId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tests',
          key: 'id'
        }
      },
      usageCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      successRate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Questions', ['category', 'difficulty']);
    await queryInterface.addIndex('Questions', ['tags']);
    await queryInterface.addIndex('Questions', ['text'], {
      type: 'FULLTEXT'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Questions');
  }
};
