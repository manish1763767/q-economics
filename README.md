# Q-Economics Online Testing Portal

A comprehensive online portal for students to access mock tests and previous year tests.

## Features

- User Authentication
- Test Taking Interface
- Performance Analytics with Data Visualization
- Previous Year Papers with PDF Support
- Administrative Panel
- Discussion Forums
- Smart Recommendation System
- Personalized Learning Paths
- Automated Progress Tracking
- Real-time Analytics Dashboard
- Export Reports in PDF/Excel

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: PostgreSQL
- ORM: Sequelize

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Set up your PostgreSQL database and update .env file
4. Run the development server:
   ```bash
   npm run dev:full
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=q_economics

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_FREQUENCY=daily  # daily, weekly, monthly
BACKUP_RETENTION_DAYS=30
BACKUP_PATH=/path/to/backups
AWS_BACKUP_BUCKET=your-backup-bucket  # Optional: for AWS S3 backups
```

## Project Structure

```
q-economics/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS and style files
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── scripts/         # Maintenance scripts
├── docs/                 # Documentation
├── backups/             # Local backups
├── .env                 # Environment variables
└── package.json        # Project dependencies
```

## Documentation

### User Guide

1. **Getting Started**
   - Registration and Login
   - Profile Setup
   - Navigation Overview

2. **Taking Tests**
   - Accessing Mock Tests
   - Previous Year Papers
   - Test Interface Guide
   - Submitting Answers
   - Viewing Results

3. **Learning Features**
   - Personalized Learning Path
   - Progress Tracking
   - Performance Analytics
   - Downloading Reports

4. **Discussion Forums**
   - Creating Posts
   - Commenting
   - Best Practices
   - Community Guidelines

### Admin Guide

1. **Content Management**
   - Creating Tests
   - Managing Questions
   - Uploading Papers
   - Setting Difficulty Levels

2. **User Management**
   - Managing Users
   - Role Assignment
   - Access Control
   - Activity Monitoring

3. **System Management**
   - Backup Configuration
   - Performance Monitoring
   - Email Templates
   - System Settings

### API Documentation

Detailed API documentation is available at `/api-docs` when running in development mode.

### Backup System

The system includes automated backup functionality:

1. **Local Backups**
   - Daily database dumps
   - File attachments backup
   - Configurable retention period

2. **Cloud Backups (Optional)**
   - AWS S3 integration
   - Encrypted backups
   - Geographic redundancy

3. **Backup Monitoring**
   - Email notifications
   - Backup verification
   - Storage monitoring

To configure backups:

1. Set the required environment variables in `.env`
2. Run the backup initialization:
   ```bash
   npm run init-backup
   ```
3. Monitor backup status:
   ```bash
   npm run backup-status
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
