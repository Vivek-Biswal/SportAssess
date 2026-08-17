import { Router } from 'express';
import { getBenchmarks } from '../controllers/benchmark.controller';

const router = Router();

// Public route for the benchmark explorer
router.get('/', getBenchmarks);

export default router;
