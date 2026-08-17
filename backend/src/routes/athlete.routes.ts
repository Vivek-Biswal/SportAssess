import { Router } from 'express';
import { getMyProfile, getAthleteById, searchAthletes } from '../controllers/athlete.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Route for athletes to get their own profile
router.get('/me', protect, authorize('athlete'), getMyProfile);

// Route for officials to search/filter athletes
router.get('/search', protect, authorize('official'), searchAthletes);

// Route for anyone authenticated to get an athlete's profile (primarily for officials)
router.get('/:id', protect, getAthleteById);

export default router;
