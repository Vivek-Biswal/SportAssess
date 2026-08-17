import mongoose, { Schema, Document } from 'mongoose';

export interface IBenchmark extends Document {
  testId: mongoose.Types.ObjectId;
  testName: string; // denormalized for easier querying/display
  ageGroup: string; // e.g., '14-16', '17-19', 'All'
  gender: 'Male' | 'Female' | 'Other' | 'All';
  p50: number; // 50th percentile (Average)
  p75: number; // 75th percentile (Above Average)
  p90: number; // 90th percentile (Excellent)
  unit: string;
}

const BenchmarkSchema: Schema = new Schema(
  {
    testId: { type: Schema.Types.ObjectId, ref: 'AssessmentTest', required: true },
    testName: { type: String, required: true },
    ageGroup: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'All'], required: true },
    p50: { type: Number, required: true },
    p75: { type: Number, required: true },
    p90: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { 
    timestamps: true 
  }
);

// Prevent re-compiling model in serverless environment
export const Benchmark = mongoose.models.Benchmark || mongoose.model<IBenchmark>('Benchmark', BenchmarkSchema);
