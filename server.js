import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// CommonJS files can be imported as ES Modules in Node.js
import connectDB from './backend/config/db.js';
import rateLimiters from './backend/middleware/rateLimiter.js';
import authRoutes from './backend/routes/authRoutes.js';
import resumeRoutes from './backend/routes/resumeRoutes.js';

const { generateApiLimiter } = rateLimiters;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // 1. Connect DB (Gracefully handled if offline)
  await connectDB();

  // 2. Middlewares & Security
  // Apply helmet specifically to API routes so it doesn't interfere with Vite dev scripts/HMR
  app.use('/api', helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(morgan('dev'));

  // 3. API Rate Limiter
  app.use('/api/', generateApiLimiter);

  // 4. API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/resume', resumeRoutes);

  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Ok', message: 'Placemate AI server is running securely!' });
  });

  // 5. Frontend Dev Server (Vite) or Production Static File Serving
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔧 Starting Vite in development middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: path.join(__dirname, 'frontend/vite.config.js'),
    });
    app.use(vite.middlewares);
  } else {
    console.log('📦 Serving production built static assets...');
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 6. Global Error Handling
  app.use((err, req, res, next) => {
    console.error('❌ Error caught by global middleware:', err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Placemate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
