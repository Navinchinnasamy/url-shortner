const express = require('express');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const { createDatabaseAdapter } = require('./db/databaseFactory');
const UrlService = require('./services/urlService');
const shortenRoutes = require('./api/routes/shorten');
const redirectRoutes = require('./api/routes/redirect');

const app = express();

// Initialize database adapter
const dbAdapter = createDatabaseAdapter(config);

// Initialize service with database adapter
const urlService = new UrlService(dbAdapter);

// Connect to database
dbAdapter.connect().catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

app.use(express.json());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
  })
);

// Inject urlService into routes
app.use((req, res, next) => {
  req.urlService = urlService;
  next();
});

// Routes
app.use('/shorten', shortenRoutes);
app.use('/', redirectRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;