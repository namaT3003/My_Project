const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ 
    status: '✅ Server is running perfectly!',
    port: process.env.PORT || 5001,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2) + 's',
    endpoints: {
      health: 'GET /api/health',
      explain: 'POST /api/explain'
    }
  });
});

module.exports = router;