const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

const LOG_DIR = process.env.LOG_DIR || 'logs';
const MAX_AGE_DAYS = process.env.LOG_RETENTION_DAYS || 14;

async function rotateLogs() {
  try {
    const files = await fs.readdir(LOG_DIR);
    const now = new Date();

    for (const file of files) {
      if (!file.endsWith('.log')) continue;

      const filePath = path.join(LOG_DIR, file);
      const stats = await fs.stat(filePath);
      const fileAge = (now - stats.mtime) / (1000 * 60 * 60 * 24); // Age in days

      if (fileAge > MAX_AGE_DAYS) {
        await fs.unlink(filePath);
        logger.info(`Deleted old log file: ${file}`);
      }
    }

    logger.info('Log rotation completed successfully');
  } catch (error) {
    logger.error('Error during log rotation', { error });
    process.exit(1);
  }
}

if (require.main === module) {
  rotateLogs();
}

module.exports = rotateLogs;
