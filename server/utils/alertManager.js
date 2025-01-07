const nodemailer = require('nodemailer');
const Slack = require('@slack/webhook');
const logger = require('./logger');

class AlertManager {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (process.env.SLACK_WEBHOOK_URL) {
      this.slackWebhook = new Slack.IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    }

    this.alertThresholds = {
      cpu: 80, // CPU usage percentage
      memory: 90, // Memory usage percentage
      disk: 85, // Disk usage percentage
      errorRate: 5, // Errors per minute
      responseTime: 2000, // Response time in ms
      databaseConnections: 100, // Number of active connections
    };
  }

  async sendAlert(type, message, data = {}, severity = 'warning') {
    try {
      const alert = {
        type,
        message,
        data,
        severity,
        timestamp: new Date().toISOString(),
      };

      logger.warn('Alert triggered', alert);

      // Send email alert
      await this.sendEmailAlert(alert);

      // Send Slack alert if configured
      if (this.slackWebhook) {
        await this.sendSlackAlert(alert);
      }

      // Store alert in database
      await this.storeAlert(alert);

    } catch (error) {
      logger.error('Failed to send alert', { error, alert: { type, message, data, severity } });
    }
  }

  async sendEmailAlert(alert) {
    const { type, message, data, severity, timestamp } = alert;

    const html = `
      <h2>System Alert: ${type}</h2>
      <p><strong>Severity:</strong> ${severity}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <h3>Details:</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    await this.emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ALERT_EMAIL_RECIPIENTS,
      subject: `[${severity.toUpperCase()}] System Alert: ${type}`,
      html,
    });
  }

  async sendSlackAlert(alert) {
    const { type, message, data, severity, timestamp } = alert;

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🚨 System Alert: ${type}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Severity:*\n${severity}`,
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${new Date(timestamp).toLocaleString()}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n${message}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Details:*\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
        },
      },
    ];

    await this.slackWebhook.send({
      blocks,
      text: `System Alert: ${type}`,
    });
  }

  async storeAlert(alert) {
    // Store alert in database for historical tracking
    // Implementation depends on your database schema
  }

  checkThresholds(metrics) {
    const alerts = [];

    // Check CPU usage
    if (metrics.cpu.usage > this.alertThresholds.cpu) {
      alerts.push({
        type: 'high_cpu_usage',
        message: `CPU usage is at ${metrics.cpu.usage}%`,
        data: metrics.cpu,
        severity: metrics.cpu.usage > 90 ? 'critical' : 'warning',
      });
    }

    // Check memory usage
    if (metrics.memory.usagePercent > this.alertThresholds.memory) {
      alerts.push({
        type: 'high_memory_usage',
        message: `Memory usage is at ${metrics.memory.usagePercent}%`,
        data: metrics.memory,
        severity: metrics.memory.usagePercent > 95 ? 'critical' : 'warning',
      });
    }

    // Check disk usage
    if (metrics.disk.usagePercent > this.alertThresholds.disk) {
      alerts.push({
        type: 'high_disk_usage',
        message: `Disk usage is at ${metrics.disk.usagePercent}%`,
        data: metrics.disk,
        severity: metrics.disk.usagePercent > 95 ? 'critical' : 'warning',
      });
    }

    // Check error rate
    if (metrics.errors.rate > this.alertThresholds.errorRate) {
      alerts.push({
        type: 'high_error_rate',
        message: `Error rate is ${metrics.errors.rate} per minute`,
        data: metrics.errors,
        severity: 'critical',
      });
    }

    // Check response time
    if (metrics.performance.avgResponseTime > this.alertThresholds.responseTime) {
      alerts.push({
        type: 'high_response_time',
        message: `Average response time is ${metrics.performance.avgResponseTime}ms`,
        data: metrics.performance,
        severity: 'warning',
      });
    }

    // Check database connections
    if (metrics.database.connections > this.alertThresholds.databaseConnections) {
      alerts.push({
        type: 'high_db_connections',
        message: `Database has ${metrics.database.connections} active connections`,
        data: metrics.database,
        severity: 'warning',
      });
    }

    return alerts;
  }

  setThreshold(metric, value) {
    if (metric in this.alertThresholds) {
      this.alertThresholds[metric] = value;
      logger.info(`Updated alert threshold`, { metric, value });
    }
  }
}

module.exports = new AlertManager();
