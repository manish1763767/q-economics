const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const SystemMonitor = require('../utils/monitoring');

// Get current system status
router.get('/status', adminAuth, async (req, res) => {
  try {
    const [
      systemMetrics,
      applicationMetrics,
      performanceMetrics,
    ] = await Promise.all([
      SystemMonitor.getSystemMetrics(),
      SystemMonitor.getApplicationMetrics(),
      SystemMonitor.getPerformanceMetrics(),
    ]);

    res.json({
      system: systemMetrics,
      application: applicationMetrics,
      performance: performanceMetrics,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get error logs
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const logs = await SystemMonitor.getErrorLogs(limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get disk usage
router.get('/disk', adminAuth, async (req, res) => {
  try {
    const usage = await SystemMonitor.getDiskUsage();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get database metrics
router.get('/database', adminAuth, async (req, res) => {
  try {
    const [
      connections,
      slowQueries,
    ] = await Promise.all([
      SystemMonitor.getDatabaseConnections(),
      SystemMonitor.getSlowQueries(),
    ]);

    res.json({
      connections,
      slowQueries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
