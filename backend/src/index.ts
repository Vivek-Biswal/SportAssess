import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { sendError } from './utils/response';
import { connectDB } from './config/db';

import authRoutes from './routes/auth.routes';
import assessmentTestRoutes from './routes/assessmentTest.routes';
import athleteRoutes from './routes/athlete.routes';
import videoRoutes from './routes/video.routes';
import benchmarkRoutes from './routes/benchmark.routes';
import officialRoutes from './routes/official.routes';
import assessmentResultRoutes from './routes/assessmentResult.routes';

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://sport-assess.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SportAssess API is running smoothly.',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentTestRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api', videoRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/official', officialRoutes);
app.use('/api/results', assessmentResultRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  sendError(
    res,
    404,
    'NOT_FOUND',
    `Route ${req.method} ${req.url} not found`
  );
});

// Global Error Handler
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error('[Global Error]', err);

    if (err.message === 'Not allowed by CORS') {
      return sendError(
        res,
        403,
        'CORS_ERROR',
        'Origin not allowed'
      );
    }

    // Handle invalid JSON
    if (err instanceof SyntaxError && 'body' in err) {
      return sendError(
        res,
        400,
        'BAD_REQUEST',
        'Invalid JSON payload'
      );
    }

    return sendError(
      res,
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred'
    );
  }
);

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Database connection established.');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

// Start Express Server
// Render provides the PORT environment variable.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export app
export default app;