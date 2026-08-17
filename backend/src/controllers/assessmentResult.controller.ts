import { Request, Response } from 'express';
import { AssessmentResult } from '../models/AssessmentResult';
import { sendSuccess, sendError } from '../utils/response';

export const getResultById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AssessmentResult.findById(id);
    if (!result) return sendError(res, 404, 'NOT_FOUND', 'Result not found');
    
    // Map to frontend structure
    const mapped = {
      id: result._id.toString(),
      athleteId: result.athleteId.toString(),
      testId: result.testId.toString(),
      date: result.date.toISOString(),
      score: result.score,
      unit: result.unit,
      aiConfidence: result.aiConfidence,
      verificationStatus: result.verificationStatus,
      cheatDetected: result.cheatDetected,
      benchmarkStatus: result.benchmarkStatus,
      percentile: result.percentile,
      videoUrl: result.videoUrl
    };

    return sendSuccess(res, 200, mapped);
  } catch (error) {
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve result');
  }
};

export const getAthleteResults = async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params;
    const results = await AssessmentResult.find({ athleteId }).sort({ date: -1 });
    
    const mapped = results.map(result => ({
      id: result._id.toString(),
      athleteId: result.athleteId.toString(),
      testId: result.testId.toString(),
      date: result.date.toISOString(),
      score: result.score,
      unit: result.unit,
      aiConfidence: result.aiConfidence,
      verificationStatus: result.verificationStatus,
      cheatDetected: result.cheatDetected,
      benchmarkStatus: result.benchmarkStatus,
      percentile: result.percentile,
      videoUrl: result.videoUrl
    }));

    return sendSuccess(res, 200, mapped);
  } catch (error) {
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve athlete results');
  }
};
