import { Router } from 'express';
import { getResultById, getAthleteResults } from '../controllers/assessmentResult.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/:id', protect, getResultById);
router.get('/athlete/:athleteId', protect, getAthleteResults);

export default router;
