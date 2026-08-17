import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // Base Auth Info
  name: string;
  email: string;
  passwordHash: string;
  role: 'athlete' | 'official';
  
  // Athlete Profile Details
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  state?: string;
  district?: string;
  sportsInterest?: string[];
  avatarUrl?: string;
  
  // Computed / System Fields
  overallScore: number;
  rank: number;
  percentile: number;
  badges: string[];
  
  // Official specific
  shortlist?: mongoose.Types.ObjectId[];
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['athlete', 'official'], default: 'athlete' },
    
    // Athlete Profile (optional for officials)
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    state: { type: String },
    district: { type: String },
    sportsInterest: { type: [String], default: [] },
    avatarUrl: { type: String },
    
    // Stats (initialized to 0/empty for new athletes)
    overallScore: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    percentile: { type: Number, default: 0 },
    badges: { type: [String], default: [] },

    // Official Specific Features
    shortlist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { 
    timestamps: true 
  }
);

// Prevent re-compiling model in serverless environment
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
