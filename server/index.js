require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const sequelize = require('./config/database');

// Middleware
app.use(cors());
app.use(express.json());

// Database connection and sync
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Import and use other route handlers here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));

// Serve static files from the React build
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const buildPath = path.join(__dirname, '../client/build');
  app.use(express.static(buildPath));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running in development mode');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database before starting server
initializeDatabase().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});
