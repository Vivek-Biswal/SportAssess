import { Request, Response } from 'express';
import { AssessmentTest } from '../models/AssessmentTest';
import { sendSuccess, sendError } from '../utils/response';

export const getAssessmentTests = async (req: Request, res: Response) => {
  try {
    const tests = await AssessmentTest.find().sort({ createdAt: 1 });
    return sendSuccess(res, 200, tests);
  } catch (error: any) {
    console.error('getAssessmentTests Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve assessment tests');
  }
};
