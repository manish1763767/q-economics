const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Test;
