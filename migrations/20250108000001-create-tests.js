'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
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
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalMarks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      passingMarks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      averageScore: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
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

    await queryInterface.addIndex('Tests', ['category', 'difficulty']);
    await queryInterface.addIndex('Tests', ['title']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tests');
  }
};
