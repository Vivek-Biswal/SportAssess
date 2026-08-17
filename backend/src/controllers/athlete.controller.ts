import { Request, Response } from 'express';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

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

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return sendError(res, 404, 'NOT_FOUND', 'Athlete profile not found');
    }

    return sendSuccess(res, 200, mapUserToAthleteProfile(user));
  } catch (error: any) {
    console.error('getMyProfile Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve profile');
  }
};

export const getAthleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, role: 'athlete' });
    
    if (!user) {
      return sendError(res, 404, 'NOT_FOUND', 'Athlete not found');
    }

    return sendSuccess(res, 200, mapUserToAthleteProfile(user));
  } catch (error: any) {
    console.error('getAthleteById Error:', error);
    
    if (error.kind === 'ObjectId') {
        return sendError(res, 404, 'NOT_FOUND', 'Athlete not found');
    }
    
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to retrieve athlete profile');
  }
};

export const searchAthletes = async (req: Request, res: Response) => {
  try {
    const query: any = { role: 'athlete' };

    // Apply optional filters from query string
    if (req.query.gender) query.gender = req.query.gender;
    if (req.query.state) query.state = new RegExp(req.query.state as string, 'i');
    if (req.query.sport) query.sportsInterest = { $in: [new RegExp(req.query.sport as string, 'i')] };
    if (req.query.minScore) query.overallScore = { $gte: Number(req.query.minScore) };
    
    // Age filtering (exact or range could be added, doing exact for simplicity based on typical mock use case)
    if (req.query.age) query.age = Number(req.query.age);

    const athletes = await User.find(query)
      .sort({ overallScore: -1 }) // Sort by highest score by default
      .limit(Number(req.query.limit) || 50);

    const mappedAthletes = athletes.map(mapUserToAthleteProfile);
    
    return sendSuccess(res, 200, mappedAthletes);
  } catch (error: any) {
    console.error('searchAthletes Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to search athletes');
  }
};
