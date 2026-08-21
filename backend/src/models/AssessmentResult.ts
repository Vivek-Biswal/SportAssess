import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentResult extends Document {
  athleteId: mongoose.Types.ObjectId;
  testId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  date: Date;
  score: number;
  unit: string;
  aiConfidence: number;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Manual Review';
  cheatDetected: boolean;
  benchmarkStatus: 'Below Average' | 'Average' | 'Above Average' | 'Excellent' | 'Not Set' | null;
  percentile: number | null;
  videoUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentResultSchema: Schema = new Schema(
  {
    athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: 'AssessmentTest', required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true, unique: true },
    date: { type: Date, required: true },
    score: { type: Number, required: true },
    unit: { type: String, required: true },
    aiConfidence: { type: Number, required: true },
    verificationStatus: { 
      type: String, 
      enum: ['Verified', 'Pending', 'Rejected', 'Manual Review'],
      required: true
    },
    cheatDetected: { type: Boolean, default: false },
    benchmarkStatus: { 
      type: String, 
      enum: ['Below Average', 'Average', 'Above Average', 'Excellent', 'Not Set', null],
      default: null 
    },
    percentile: { type: Number, default: null },
    videoUrl: { type: String }
  },
  { 
    timestamps: true 
  }
);

export const AssessmentResult = mongoose.models.AssessmentResult || mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
