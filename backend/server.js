require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MockTest, PreviousPaper, initDb } = require('./models');

// Verify database URL is available
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and models
initDb();

// API routes
app.use('/api', (req, res, next) => {
    req.url = req.url.replace('/api', '');
    next();
});

// Define routes for mock tests
app.get('/mock-tests', async (req, res) => {
    try {
        const mockTests = await MockTest.findAll();
        res.json(mockTests);
    } catch (error) {
        console.error('Error fetching mock tests:', error);
        res.status(500).json({ error: 'Error fetching mock tests' });
    }
});

// Define routes for previous papers
app.get('/previous-papers', async (req, res) => {
    try {
        const papers = await PreviousPaper.findAll();
        res.json(papers);
    } catch (error) {
        console.error('Error fetching previous papers:', error);
        res.status(500).json({ error: 'Error fetching previous papers' });
    }
});

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
