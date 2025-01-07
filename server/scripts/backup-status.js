const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { promisify } = require('util');
const statAsync = promisify(fs.stat);
require('dotenv').config();

const { BACKUP_PATH } = process.env;

async function getBackupStatus() {
  try {
    const backupDir = path.resolve(BACKUP_PATH);
    if (!fs.existsSync(backupDir)) {
      return {
        status: 'error',
        message: 'Backup directory does not exist',
        lastBackup: null,
        backupCount: 0,
        totalSize: 0,
      };
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(backupDir, file));

    let totalSize = 0;
    let latestBackup = null;

    for (const file of files) {
      const stats = await statAsync(file);
      totalSize += stats.size;

      if (!latestBackup || stats.mtime > latestBackup.mtime) {
        latestBackup = {
          file: path.basename(file),
          mtime: stats.mtime,
          size: stats.size,
        };
      }
    }

    return {
      status: 'ok',
      message: 'Backup system is operational',
      lastBackup: latestBackup ? {
        filename: latestBackup.file,
        timestamp: moment(latestBackup.mtime).format('YYYY-MM-DD HH:mm:ss'),
        size: (latestBackup.size / 1024 / 1024).toFixed(2) + ' MB',
      } : null,
      backupCount: files.length,
      totalSize: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error checking backup status: ${error.message}`,
      lastBackup: null,
      backupCount: 0,
      totalSize: 0,
    };
  }
}

async function printStatus() {
  const status = await getBackupStatus();
  console.log('\nBackup System Status');
  console.log('===================');
  console.log(`Status: ${status.status}`);
  console.log(`Message: ${status.message}`);
  
  if (status.lastBackup) {
    console.log('\nLast Backup');
    console.log('-----------');
    console.log(`Filename: ${status.lastBackup.filename}`);
    console.log(`Timestamp: ${status.lastBackup.timestamp}`);
    console.log(`Size: ${status.lastBackup.size}`);
  }

  console.log('\nSummary');
  console.log('-------');
  console.log(`Total Backups: ${status.backupCount}`);
  console.log(`Total Size: ${status.totalSize}`);
}

// If running directly (not imported as module)
if (require.main === module) {
  printStatus();
}

module.exports = {
  getBackupStatus,
  printStatus,
};
