const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { adminAuth } = require('../middleware/auth');
const { PreviousPaper } = require('../models');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/papers';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Get all papers
router.get('/previous-papers', async (req, res) => {
    try {
        const papers = await PreviousPaper.findAll();
        res.json(papers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new paper with PDF upload (admin only)
router.post('/previous-papers', adminAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('PDF file is required');
        }

        const paper = await PreviousPaper.create({
            title: req.body.title,
            type: req.body.type,
            url: `/uploads/papers/${req.file.filename}`
        });

        res.status(201).json(paper);
    } catch (error) {
        // Delete uploaded file if database operation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: error.message });
    }
});

// Update paper (admin only)
router.put('/previous-papers/:id', adminAuth, upload.single('file'), async (req, res) => {
    try {
        const paper = await PreviousPaper.findByPk(req.params.id);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        const updateData = {
            title: req.body.title,
            type: req.body.type
        };

        if (req.file) {
            // Delete old file
            if (paper.url) {
                const oldFilePath = path.join(__dirname, '..', '..', paper.url);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            // Update with new file
            updateData.url = `/uploads/papers/${req.file.filename}`;
        }

        await paper.update(updateData);
        res.json(paper);
    } catch (error) {
        // Delete uploaded file if database operation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: error.message });
    }
});

// Delete paper (admin only)
router.delete('/previous-papers/:id', adminAuth, async (req, res) => {
    try {
        const paper = await PreviousPaper.findByPk(req.params.id);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        // Delete file from storage
        if (paper.url) {
            const filePath = path.join(__dirname, '..', '..', paper.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await paper.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download paper
router.get('/previous-papers/:id/download', async (req, res) => {
    try {
        const paper = await PreviousPaper.findByPk(req.params.id);
        if (!paper || !paper.url) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        const filePath = path.join(__dirname, '..', '..', paper.url);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
