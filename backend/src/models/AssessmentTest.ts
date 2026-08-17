import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentTest extends Document {
  name: string;
  category: string;
  description: string;
  measurementUnit: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDurationMin: number;
  aiVerificationAvailable: boolean;
  icon?: string;
}

const AssessmentTestSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    measurementUnit: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    estimatedDurationMin: { type: Number, required: true },
    aiVerificationAvailable: { type: Boolean, default: false },
    icon: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

export const AssessmentTest = mongoose.models.AssessmentTest || mongoose.model<IAssessmentTest>('AssessmentTest', AssessmentTestSchema);
