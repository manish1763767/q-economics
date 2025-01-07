const os = require('os');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const sequelize = require('../config/database');
const Test = require('../models/Test');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

class SystemMonitor {
  static async getSystemMetrics() {
    const cpuUsage = os.loadavg()[0];
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

    let dbStatus = 'healthy';
    try {
      await sequelize.authenticate();
    } catch (error) {
      dbStatus = 'error';
    }

    return {
      cpu: {
        usage: cpuUsage.toFixed(2),
        cores: os.cpus().length,
      },
      memory: {
        total: (totalMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        free: (freeMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usage: memoryUsage.toFixed(2) + '%',
      },
      uptime: os.uptime(),
      database: {
        status: dbStatus,
        connections: await this.getDatabaseConnections(),
      },
    };
  }

  static async getDatabaseConnections() {
    try {
      const [result] = await sequelize.query(
        'SELECT count(*) as count FROM pg_stat_activity'
      );
      return result[0].count;
    } catch (error) {
      console.error('Error getting database connections:', error);
      return 0;
    }
  }

  static async getApplicationMetrics() {
    try {
      const [
        activeUsers,
        totalTests,
        ongoingTests,
        feedbackCount,
      ] = await Promise.all([
        User.count({ where: { lastActive: { [Op.gt]: new Date(Date.now() - 15 * 60 * 1000) } } }),
        Test.count(),
        Test.count({ where: { status: 'in_progress' } }),
        Feedback.count({ where: { status: 'open' } }),
      ]);

      return {
        activeUsers,
        totalTests,
        ongoingTests,
        feedbackCount,
      };
    } catch (error) {
      console.error('Error getting application metrics:', error);
      return null;
    }
  }

  static async getErrorLogs(limit = 100) {
    try {
      const { stdout } = await exec(`tail -n ${limit} logs/error.log`);
      return stdout.split('\n').filter(Boolean);
    } catch (error) {
      console.error('Error reading error logs:', error);
      return [];
    }
  }

  static async getPerformanceMetrics() {
    try {
      const [
        avgResponseTime,
        slowQueries,
        errorRate,
      ] = await Promise.all([
        this.getAverageResponseTime(),
        this.getSlowQueries(),
        this.getErrorRate(),
      ]);

      return {
        avgResponseTime,
        slowQueries,
        errorRate,
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return null;
    }
  }

  static async getAverageResponseTime() {
    // Implementation would depend on your logging/metrics system
    return 0;
  }

  static async getSlowQueries() {
    try {
      const [result] = await sequelize.query(`
        SELECT query, calls, total_time, mean_time
        FROM pg_stat_statements
        ORDER BY mean_time DESC
        LIMIT 10;
      `);
      return result;
    } catch (error) {
      console.error('Error getting slow queries:', error);
      return [];
    }
  }

  static async getErrorRate() {
    // Implementation would depend on your logging/metrics system
    return 0;
  }

  static async getDiskUsage() {
    try {
      const { stdout } = await exec('df -h');
      return stdout.split('\n').filter(Boolean);
    } catch (error) {
      console.error('Error getting disk usage:', error);
      return [];
    }
  }

  static startMonitoring(interval = 60000) {
    return setInterval(async () => {
      try {
        const metrics = {
          timestamp: new Date(),
          system: await this.getSystemMetrics(),
          application: await this.getApplicationMetrics(),
          performance: await this.getPerformanceMetrics(),
        };

        // Store metrics in database or send to monitoring service
        await this.storeMetrics(metrics);

        // Check for alerts
        await this.checkAlerts(metrics);
      } catch (error) {
        console.error('Error in monitoring cycle:', error);
      }
    }, interval);
  }

  static async storeMetrics(metrics) {
    // Implementation would depend on your storage solution
    console.log('Storing metrics:', metrics);
  }

  static async checkAlerts(metrics) {
    // CPU Usage Alert
    if (parseFloat(metrics.system.cpu.usage) > 80) {
      await this.sendAlert('High CPU Usage', `CPU usage is at ${metrics.system.cpu.usage}%`);
    }

    // Memory Usage Alert
    if (parseFloat(metrics.system.memory.usage) > 90) {
      await this.sendAlert('High Memory Usage', `Memory usage is at ${metrics.system.memory.usage}`);
    }

    // Database Connections Alert
    if (metrics.system.database.connections > 100) {
      await this.sendAlert('High Database Connections', 
        `Database has ${metrics.system.database.connections} active connections`);
    }
  }

  static async sendAlert(title, message) {
    // Implementation would depend on your notification system
    console.log('Alert:', title, message);
  }
}

module.exports = SystemMonitor;
