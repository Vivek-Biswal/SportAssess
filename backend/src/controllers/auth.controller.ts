import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};

const mapUserToFrontend = (user: IUser) => {
  return {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
    age: user.age,
    gender: user.gender,
    state: user.state,
    district: user.district,
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, age, gender, state, district } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Name, email, and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 400, 'USER_EXISTS', 'Email is already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: role === 'official' ? 'official' : 'athlete',
      age,
      gender,
      state,
      district
    });

    const token = generateToken(user.id, user.role);

    return sendSuccess(res, 201, {
      token,
      user: mapUserToFrontend(user)
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to register user');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Login failed: User not found for email', normalizedEmail);
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('Login failed: Password mismatch for email', normalizedEmail);
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const token = generateToken(user.id, user.role);

    return sendSuccess(res, 200, {
      token,
      user: mapUserToFrontend(user)
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to login');
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return sendError(res, 404, 'NOT_FOUND', 'User not found');
    }

    return sendSuccess(res, 200, {
      user: mapUserToFrontend(user)
    });
  } catch (error: any) {
    console.error('GetMe Error:', error);
    return sendError(res, 500, 'SERVER_ERROR', 'Failed to get user profile');
  }
};
