import { Router } from 'express';
import multer from 'multer';
import { uploadVideo, checkProcessStatus } from '../controllers/video.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Use memory storage to avoid writing to Vercel's ephemeral filesystem
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Basic video validation
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only videos are allowed.'));
    }
  }
});

// Athlete only: Upload video for an assessment
router.post('/videos/upload', protect, authorize('athlete'), upload.single('video'), uploadVideo);

// Poll for AI processing status
router.get('/ai/process/:id', protect, checkProcessStatus);

export default router;
