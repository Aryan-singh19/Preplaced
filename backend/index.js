require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { generateApiLimiter } = require('./middleware/rateLimiter');

// 1. Initialize Express app
const app = express();

// 2. Connect to the Database
connectDB();

// 3. Security Middlewares & Parsers
app.use(helmet()); // Protects against common web vulnerabilities by setting HTTP headers
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Restrict CORS correctly
app.use(express.json({ limit: '1mb' })); // Limit body payload size to prevent payload overflow attacks
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev')); // API logging for monitoring

// 4. Global Rate Limiter applied to all routes
app.use('/api/', generateApiLimiter);

// 5. Basic Health Check Router
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Ok', message: 'Placemate AI server is running securely!' });
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 7. Initialize Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Secure Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
