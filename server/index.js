require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const app = express();

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Import routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);

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
  res.status(err.status || 500).json({ 
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Sync database (in development)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
