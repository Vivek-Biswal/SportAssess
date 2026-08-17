import { Request, Response } from 'express';
import { User } from '../models/User';
import { Assessment } from '../models/Assessment';
import { sendSuccess, sendError } from '../utils/response';

export const getOfficialStats = async (req: Request, res: Response) => {
  try {
    // 1. Total Athletes
    const totalAthletes = await User.countDocuments({ role: 'athlete' });

    // 2. Verified Assessments
    const verifiedAssessments = await Assessment.countDocuments({ status: 'verified' });

    // 3. Pending Reviews
    const pendingReviews = await Assessment.countDocuments({ status: 'manual_review' });

    // 4. High Potential Athletes (configurable threshold)
    // Default to 75th percentile if not configured in ENV
    const highPotentialThreshold = Number(process.env.HIGH_POTENTIAL_PERCENTILE) || 75;
    const highPotentialAthletes = await User.countDocuments({ 
      role: 'athlete', 
      percentile: { $gte: highPotentialThreshold } 
    });

    const stats = {
      totalAthletes,
      verifiedAssessments,
      pendingReviews,
      highPotentialAthletes
    };

    return sendSuccess(res, 200, stats);
  } catch (error: any) {
    console.error('getOfficialStats Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve official stats');
  }
};

const mapUserToAthleteProfile = (user: any) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    state: user.state,
    district: user.district,
    sportsInterest: user.sportsInterest,
    avatarUrl: user.avatarUrl,
    overallScore: user.overallScore,
    rank: user.rank,
    percentile: user.percentile,
    badges: user.badges,
  };
};

export const getShortlist = async (req: any, res: Response) => {
  try {
    const official = await User.findById(req.user.id).populate('shortlist');
    if (!official) {
      return sendError(res, 404, 'NOT_FOUND', 'Official not found');
    }
    
    // Ensure shortlist is populated with athletes
    const athletes = official.shortlist as any[];
    const mapped = athletes.map(mapUserToAthleteProfile);
    
    return sendSuccess(res, 200, mapped);
  } catch (error: any) {
    console.error('getShortlist Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve shortlist');
  }
};

export const addToShortlist = async (req: any, res: Response) => {
  try {
    const { athleteId } = req.body;
    
    if (!athleteId) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'athleteId is required');
    }
    
    const official = await User.findById(req.user.id);
    if (!official) return sendError(res, 404, 'NOT_FOUND', 'Official not found');
    
    // Ensure athlete exists
    const athlete = await User.findOne({ _id: athleteId, role: 'athlete' });
    if (!athlete) return sendError(res, 404, 'NOT_FOUND', 'Athlete not found');
    
    // Add if not present
    if (!official.shortlist?.includes(athlete.id)) {
      official.shortlist = official.shortlist || [];
      official.shortlist.push(athlete.id);
      await official.save();
    }
    
    return sendSuccess(res, 200, { success: true });
  } catch (error: any) {
    console.error('addToShortlist Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to add to shortlist');
  }
};

export const removeFromShortlist = async (req: any, res: Response) => {
  try {
    const { athleteId } = req.params;
    
    const official = await User.findById(req.user.id);
    if (!official) return sendError(res, 404, 'NOT_FOUND', 'Official not found');
    
    if (official.shortlist) {
      official.shortlist = official.shortlist.filter((id: any) => id.toString() !== athleteId);
      await official.save();
    }
    
    return sendSuccess(res, 200, { success: true });
  } catch (error: any) {
    console.error('removeFromShortlist Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to remove from shortlist');
  }
};
