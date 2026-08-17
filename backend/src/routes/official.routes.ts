import { Router } from 'express';
import { getOfficialStats } from '../controllers/official.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Only authenticated officials can access dashboard stats
router.get('/stats', protect, authorize('official'), getOfficialStats);

export default router;
