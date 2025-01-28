require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { initDb } = require('./models');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const paperRoutes = require('./routes/papers');

// Verify required environment variables
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
    console.error('Required environment variables are missing');
    process.exit(1);
}

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', testRoutes);
app.use('/api', paperRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Initialize database and models
initDb();

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
