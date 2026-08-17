export interface Athlete {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  district: string;
  sportsInterest: string[];
  avatarUrl?: string;
  overallScore: number;
  rank: number;
  percentile: number;
  badges: string[];
}

export interface AssessmentTest {
  id: string;
  name: string;
  category: string;
  description: string;
  measurementUnit: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDurationMin: number;
  aiVerificationAvailable: boolean;
  icon?: string;
}

export interface AssessmentResult {
  id: string;
  athleteId: string;
  testId: string;
  date: string;
  score: number;
  unit: string;
  aiConfidence: number;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Manual Review';
  cheatDetected: boolean;
  benchmarkStatus: 'Below Average' | 'Average' | 'Above Average' | 'Excellent';
  percentile: number;
  videoUrl?: string;
}

export interface OfficialStats {
  totalAthletes: number;
  verifiedAssessments: number;
  pendingReviews: number;
  highPotentialAthletes: number;
}
