const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerformanceMetric = sequelize.define('PerformanceMetric', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

// Static methods for common metric types
PerformanceMetric.recordResponseTime = async function(name, value, tags = {}) {
  return this.create({
    type: 'response_time',
    name,
    value,
    unit: 'ms',
    tags,
  });
};

PerformanceMetric.recordThroughput = async function(name, value, tags = {}) {
  return this.create({
    type: 'throughput',
    name,
    value,
    unit: 'req/s',
    tags,
  });
};

PerformanceMetric.recordErrorRate = async function(name, value, tags = {}) {
  return this.create({
    type: 'error_rate',
    name,
    value,
    unit: 'errors/s',
    tags,
  });
};

PerformanceMetric.recordConcurrentUsers = async function(value, tags = {}) {
  return this.create({
    type: 'concurrent_users',
    name: 'active_users',
    value,
    unit: 'users',
    tags,
  });
};

PerformanceMetric.recordMemoryUsage = async function(value, tags = {}) {
  return this.create({
    type: 'memory_usage',
    name: 'heap_used',
    value,
    unit: 'MB',
    tags,
  });
};

PerformanceMetric.recordCPUUsage = async function(value, tags = {}) {
  return this.create({
    type: 'cpu_usage',
    name: 'process_cpu',
    value,
    unit: 'percent',
    tags,
  });
};

// Query methods
PerformanceMetric.getMetricsByTimeRange = async function(type, startTime, endTime, tags = {}) {
  const where = {
    type,
    timestamp: {
      [sequelize.Op.between]: [startTime, endTime],
    },
  };

  // Add tag filters if provided
  if (Object.keys(tags).length > 0) {
    where.tags = tags;
  }

  return this.findAll({
    where,
    order: [['timestamp', 'ASC']],
  });
};

PerformanceMetric.getAggregatedMetrics = async function(type, startTime, endTime, interval = '1 hour') {
  return this.findAll({
    attributes: [
      [sequelize.fn('date_trunc', interval, sequelize.col('timestamp')), 'interval'],
      [sequelize.fn('avg', sequelize.col('value')), 'avg_value'],
      [sequelize.fn('min', sequelize.col('value')), 'min_value'],
      [sequelize.fn('max', sequelize.col('value')), 'max_value'],
      [sequelize.fn('count', sequelize.col('id')), 'count'],
    ],
    where: {
      type,
      timestamp: {
        [sequelize.Op.between]: [startTime, endTime],
      },
    },
    group: [sequelize.fn('date_trunc', interval, sequelize.col('timestamp'))],
    order: [[sequelize.fn('date_trunc', interval, sequelize.col('timestamp')), 'ASC']],
  });
};

module.exports = PerformanceMetric;
