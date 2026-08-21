import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AssessmentTest } from '../models/AssessmentTest';
import { Assessment } from '../models/Assessment';
import { AssessmentResult } from '../models/AssessmentResult';
import { StorageService } from '../services/storage.service';
import { CVService } from '../services/cv.service';
import { sendSuccess, sendError } from '../utils/response';

export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    const athleteId = req.user?.id;
    const testId = req.body.testId;
    const file = req.file;

    if (!file) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'No video file provided');
    }

    if (!testId) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'testId is required');
    }

    const test = await AssessmentTest.findById(testId);
    if (!test) {
      return sendError(res, 404, 'NOT_FOUND', 'Assessment test not found');
    }

    // 1. Upload to storage provider
    const uploadResult = await StorageService.uploadVideo(file.buffer, file.originalname, file.mimetype);

    // 2. Create Assessment record
    const assessment = await Assessment.create({
      athleteId,
      testId,
      status: 'submitted',
      videoUrl: uploadResult.url,
      videoStorageKey: uploadResult.storageKey,
      submittedAt: new Date(),
    });

    // 3. Trigger CV Processing
    try {
      const cvJob = await CVService.analyzeVideo({
        assessmentId: assessment.id,
        athleteId: athleteId as string,
        testType: test.name, // or a slug if preferred
        videoUrl: uploadResult.url
      });

      // 4. Update Assessment with Job ID
      assessment.aiJobId = cvJob.jobId;
      assessment.status = 'processing';
      assessment.processingStartedAt = new Date();
      await assessment.save();

      return sendSuccess(res, 202, { processId: assessment.id });
    } catch (cvError) {
      console.error('CV Service failed to start:', cvError);
      assessment.status = 'failed';
      await assessment.save();
      return sendError(res, 502, 'CV_SERVICE_ERROR', 'Failed to start AI analysis');
    }
  } catch (error: any) {
    console.error('uploadVideo Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to upload video');
  }
};

export const checkProcessStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // This is the Assessment ID (processId)

    const assessment = await Assessment.findById(id).populate('testId');
    if (!assessment) {
      return sendError(res, 404, 'NOT_FOUND', 'Assessment not found');
    }

    // Security check: Only the athlete who submitted or an official can view
    if (req.user?.role === 'athlete' && assessment.athleteId.toString() !== req.user.id) {
      return sendError(res, 403, 'FORBIDDEN', 'Access denied');
    }

    // If already completed, just return the result
    if (['verified', 'failed', 'rejected', 'manual_review'].includes(assessment.status)) {
      return sendSuccess(res, 200, { 
        status: assessment.status === 'verified' ? 'completed' : assessment.status, 
        resultId: assessment.resultId 
      });
    }

    // If no AI job, it failed early
    if (!assessment.aiJobId) {
      return sendSuccess(res, 200, { status: 'failed' });
    }

    // Poll CV Service
    const cvStatus = await CVService.getProcessingStatus(assessment.aiJobId);

    if (cvStatus.processing_status === 'processing') {
      return sendSuccess(res, 200, { status: 'processing' });
    }

    if (cvStatus.processing_status === 'failed') {
      assessment.status = 'failed';
      assessment.completedAt = new Date();
      await assessment.save();
      return sendSuccess(res, 200, { status: 'failed' });
    }

    // Job Success! Create Result
    if (cvStatus.processing_status === 'success' && 'score' in cvStatus) {
      const result = await AssessmentResult.create({
        athleteId: assessment.athleteId,
        testId: assessment.testId,
        assessmentId: assessment.id,
        date: new Date(),
        score: cvStatus.score ?? 0,
        unit: cvStatus.unit || 'units',
        aiConfidence: cvStatus.confidence,
        verificationStatus: cvStatus.verification_status === 'verified' ? 'Verified' : 'Manual Review',
        cheatDetected: cvStatus.cheat_detected,
        benchmarkStatus: 'Not Set', // Handled later
        percentile: 0, // Handled later
        videoUrl: assessment.videoUrl
      });

      // Update Assessment
      assessment.status = cvStatus.verification_status === 'verified' ? 'verified' : 'manual_review';
      assessment.resultId = result.id;
      assessment.completedAt = new Date();
      await assessment.save();

      return sendSuccess(res, 200, { 
        status: 'completed', 
        resultId: result.id 
      });
    }

    return sendSuccess(res, 200, { status: 'processing' });
  } catch (error: any) {
    console.error('checkProcessStatus Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to check process status');
  }
};
