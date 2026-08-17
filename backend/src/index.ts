import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sendError } from './utils/response';
import { connectDB } from './config/db';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().catch(console.error);

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting (basic anti-abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration (allow frontend origin or default to localhost for dev)
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

import authRoutes from './routes/auth.routes';
import assessmentTestRoutes from './routes/assessmentTest.routes';
import athleteRoutes from './routes/athlete.routes';
import videoRoutes from './routes/video.routes';
import benchmarkRoutes from './routes/benchmark.routes';
import officialRoutes from './routes/official.routes';
import assessmentResultRoutes from './routes/assessmentResult.routes';

// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'SportAssess API is running smoothly.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentTestRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api', videoRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/official', officialRoutes);
app.use('/api/results', assessmentResultRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.url} not found`);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error]', err);
  
  if (err.message === 'Not allowed by CORS') {
    return sendError(res, 403, 'CORS_ERROR', 'Origin not allowed');
  }

  // Handle SyntaxError for bad JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return sendError(res, 400, 'BAD_REQUEST', 'Invalid JSON payload');
  }

  sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
});

// Start Server (only if not running in serverless environment)
if (process.env.NODE_ENV !== 'production' || process.env.START_SERVER === 'true') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
