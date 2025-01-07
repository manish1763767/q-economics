const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { promisify } = require('util');
const execAsync = promisify(exec);

require('dotenv').config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  BACKUP_PATH,
  BACKUP_RETENTION_DAYS,
  AWS_BACKUP_BUCKET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
} = process.env;

const s3 = new AWS.S3();
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === '465',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function createBackupDirectory() {
  const backupDir = path.resolve(BACKUP_PATH);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

async function createDatabaseBackup() {
  const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
  const backupDir = await createBackupDirectory();
  const filename = `backup_${DB_NAME}_${timestamp}.sql`;
  const filePath = path.join(backupDir, filename);

  try {
    const cmd = `pg_dump -h ${DB_HOST} -U ${DB_USER} -F c -b -v -f "${filePath}" ${DB_NAME}`;
    await execAsync(cmd, { env: { PGPASSWORD: DB_PASSWORD } });
    return filePath;
  } catch (error) {
    throw new Error(`Database backup failed: ${error.message}`);
  }
}

async function uploadToS3(filePath) {
  if (!AWS_BACKUP_BUCKET) return;

  const filename = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);

  try {
    await s3.upload({
      Bucket: AWS_BACKUP_BUCKET,
      Key: `database-backups/${filename}`,
      Body: fileStream,
      ServerSideEncryption: 'AES256',
    }).promise();
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

async function cleanupOldBackups() {
  const backupDir = await createBackupDirectory();
  const retentionDate = moment().subtract(BACKUP_RETENTION_DAYS, 'days');

  const files = fs.readdirSync(backupDir);
  for (const file of files) {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    if (moment(stats.mtime).isBefore(retentionDate)) {
      fs.unlinkSync(filePath);
    }
  }
}

async function sendNotification(success, error = null) {
  const subject = success
    ? 'Backup Completed Successfully'
    : 'Backup Failed';
  
  const html = success
    ? `
      <h2>Database Backup Completed</h2>
      <p>The database backup was completed successfully.</p>
      <p>Timestamp: ${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
      `
    : `
      <h2>Database Backup Failed</h2>
      <p>The database backup operation failed with the following error:</p>
      <pre>${error}</pre>
      <p>Timestamp: ${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
      `;

  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: SMTP_USER, // Send to admin email
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
}

async function runBackup() {
  try {
    console.log('Starting backup process...');
    
    // Create database backup
    const backupPath = await createDatabaseBackup();
    console.log('Database backup created:', backupPath);

    // Upload to S3 if configured
    if (AWS_BACKUP_BUCKET) {
      await uploadToS3(backupPath);
      console.log('Backup uploaded to S3');
    }

    // Cleanup old backups
    await cleanupOldBackups();
    console.log('Old backups cleaned up');

    // Send success notification
    await sendNotification(true);
    console.log('Backup completed successfully');
  } catch (error) {
    console.error('Backup failed:', error);
    await sendNotification(false, error.message);
  }
}

// If running directly (not imported as module)
if (require.main === module) {
  runBackup();
}

module.exports = {
  runBackup,
  createDatabaseBackup,
  uploadToS3,
  cleanupOldBackups,
};
