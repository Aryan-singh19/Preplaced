const { rateLimit } = require('express-rate-limit');

// 1. General API Rate Limiter (Protects against basic DDoS)
const generateApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});

// 2. Strict AI Model Rate Limiter (Protects your OpenAI billing!)
const aiApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 15 AI requests per hour
  message: 'AI Endpoint rate limit exceeded. Please wait an hour to avoid server overload.',
});

module.exports = {
  generateApiLimiter,
  aiApiLimiter
};
