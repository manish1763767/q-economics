const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemAlert = sequelize.define('SystemAlert', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('info', 'warning', 'critical'),
    defaultValue: 'warning',
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  acknowledgedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
  },
  resolvedAt: {
    type: DataTypes.DATE,
  },
  notificationsSent: {
    type: DataTypes.JSONB,
    defaultValue: {
      email: false,
      slack: false,
    },
  },
});

module.exports = SystemAlert;
