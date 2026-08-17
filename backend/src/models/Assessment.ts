import mongoose, { Schema, Document } from 'mongoose';

export type AssessmentStatus = 'draft' | 'submitted' | 'processing' | 'verified' | 'failed' | 'rejected' | 'manual_review';

export interface IAssessment extends Document {
  athleteId: mongoose.Types.ObjectId;
  testId: mongoose.Types.ObjectId;
  status: AssessmentStatus;
  
  // Storage reference for the uploaded video
  videoUrl?: string;
  videoStorageKey?: string;
  
  // Timestamps for the workflow lifecycle
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  processingStartedAt?: Date;
  completedAt?: Date;
  
  // ID from the CV service job for polling
  aiJobId?: string;
  
  // Associated result once processing is complete
  resultId?: mongoose.Types.ObjectId;
}

const AssessmentSchema: Schema = new Schema(
  {
    athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: 'AssessmentTest', required: true },
    status: { 
      type: String, 
      enum: ['draft', 'submitted', 'processing', 'verified', 'failed', 'rejected', 'manual_review'],
      default: 'draft' 
    },
    
    videoUrl: { type: String },
    videoStorageKey: { type: String },
    
    submittedAt: { type: Date },
    processingStartedAt: { type: Date },
    completedAt: { type: Date },
    
    aiJobId: { type: String },
    resultId: { type: Schema.Types.ObjectId, ref: 'AssessmentResult' }
  },
  { 
    timestamps: true 
  }
);

// Prevent re-compiling model in serverless environment
export const Assessment = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
