import { Request, Response } from 'express';
import { Benchmark } from '../models/Benchmark';
import { sendSuccess, sendError } from '../utils/response';

export const getBenchmarks = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    
    // Optional filtering
    if (req.query.test) {
      query.testName = new RegExp(req.query.test as string, 'i');
    }
    if (req.query.gender) {
      query.gender = req.query.gender;
    }
    if (req.query.ageGroup) {
      query.ageGroup = req.query.ageGroup;
    }

    const benchmarks = await Benchmark.find(query).sort({ testName: 1, ageGroup: 1 });
    
    return sendSuccess(res, 200, benchmarks);
  } catch (error: any) {
    console.error('getBenchmarks Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve benchmarks');
  }
};
