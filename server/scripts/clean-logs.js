const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

const LOG_DIR = process.env.LOG_DIR || 'logs';

async function cleanLogs() {
  try {
    // Create logs directory if it doesn't exist
    await fs.mkdir(LOG_DIR, { recursive: true });

    const files = await fs.readdir(LOG_DIR);
    let totalSize = 0;
    let deletedCount = 0;

    // Calculate total size and delete empty files
    for (const file of files) {
      if (!file.endsWith('.log')) continue;

      const filePath = path.join(LOG_DIR, file);
      const stats = await fs.stat(filePath);

      if (stats.size === 0) {
        await fs.unlink(filePath);
        deletedCount++;
        logger.info(`Deleted empty log file: ${file}`);
      } else {
        totalSize += stats.size;
      }
    }

    logger.info('Log cleanup completed', {
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      deletedCount,
    });
  } catch (error) {
    logger.error('Error during log cleanup', { error });
    process.exit(1);
  }
}

if (require.main === module) {
  cleanLogs();
}

module.exports = cleanLogs;
