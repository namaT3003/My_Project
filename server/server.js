const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port
const PORT = process.env.PORT || 5001;

// Routes
const explainRoutes = require('./routes/explainRoutes');
const healthRoutes = require('./routes/healthRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api', explainRoutes);
app.use('/api', healthRoutes);
app.use('/api', quizRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    availableEndpoints: {
      explain: 'POST /api/explain',
      quiz: 'POST /api/quiz',
      health: 'GET /api/health'
    }
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 SkillMentor Backend Server        ║
║   Running on PORT ${PORT}              ║
║   Environment: ${process.env.NODE_ENV}        ║
║   🔗 Health Check: /api/health         ║
║   🤖 Explain API: POST /api/explain    ║
║   📝 Quiz API: POST /api/quiz          ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;