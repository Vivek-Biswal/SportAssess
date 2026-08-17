import { Router } from 'express';
import { getAssessmentTests } from '../controllers/assessmentTest.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Protected route so only authenticated users (athletes or officials) can view the tests
router.get('/', protect, getAssessmentTests);

export default router;
