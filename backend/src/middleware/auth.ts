import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Not authorized to access this route. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    
    // Check if user still exists
    const user = await User.findById(decoded.id).select('id role');
    if (!user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'The user belonging to this token no longer exists.');
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Not authorized to access this route. Invalid token.');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, 'FORBIDDEN', `User role '${req.user?.role}' is not authorized to access this route.`);
    }
    next();
  };
};
