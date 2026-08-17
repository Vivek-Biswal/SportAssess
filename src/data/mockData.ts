import { Athlete, AssessmentTest, AssessmentResult, OfficialStats } from '../types';

export const mockAthletes: Athlete[] = [
  {
    id: 'a1',
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    age: 18,
    gender: 'Male',
    state: 'Maharashtra',
    district: 'Pune',
    sportsInterest: ['Athletics', 'Football'],
    overallScore: 85,
    rank: 124,
    percentile: 92,
    badges: ['Consistency Star', 'Top 10%'],
  },
  {
    id: 'a2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    age: 16,
    gender: 'Female',
    state: 'Delhi',
    district: 'New Delhi',
    sportsInterest: ['Badminton', 'Gymnastics'],
    overallScore: 91,
    rank: 42,
    percentile: 98,
    badges: ['Speed Champion', 'Excellent Performer'],
  },
  {
    id: 'a3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    age: 19,
    gender: 'Male',
    state: 'Gujarat',
    district: 'Ahmedabad',
    sportsInterest: ['Cricket', 'Athletics'],
    overallScore: 72,
    rank: 890,
    percentile: 75,
    badges: ['First Assessment'],
  }
];

export const mockTests: AssessmentTest[] = [
  {
    id: 't1',
    name: 'Vertical Jump',
    category: 'Explosiveness',
    description: 'Measures explosive lower-body power. AI detects takeoff/landing movement and estimates jump performance.',
    measurementUnit: 'cm',
    difficulty: 'Intermediate',
    estimatedDurationMin: 5,
    aiVerificationAvailable: true,
  },
  {
    id: 't2',
    name: 'Sit-Ups (1 Min)',
    category: 'Core Endurance',
    description: 'Measures core endurance. AI assists with repetition counting and movement verification.',
    measurementUnit: 'reps',
    difficulty: 'Beginner',
    estimatedDurationMin: 2,
    aiVerificationAvailable: true,
  },
  {
    id: 't3',
    name: 'Shuttle Run',
    category: 'Agility',
    description: 'Measures agility and speed. AI-assisted timing and movement analysis.',
    measurementUnit: 'sec',
    difficulty: 'Intermediate',
    estimatedDurationMin: 10,
    aiVerificationAvailable: false,
  }
];

export const mockResults: AssessmentResult[] = [
  {
    id: 'r1',
    athleteId: 'a1',
    testId: 't1',
    date: '2023-10-15T10:00:00Z',
    score: 55.2,
    unit: 'cm',
    aiConfidence: 94,
    verificationStatus: 'Verified',
    cheatDetected: false,
    benchmarkStatus: 'Excellent',
    percentile: 91,
  },
  {
    id: 'r2',
    athleteId: 'a1',
    testId: 't2',
    date: '2023-10-20T14:30:00Z',
    score: 45,
    unit: 'reps',
    aiConfidence: 88,
    verificationStatus: 'Pending',
    cheatDetected: false,
    benchmarkStatus: 'Above Average',
    percentile: 78,
  }
];

export const mockOfficialStats: OfficialStats = {
  totalAthletes: 12540,
  verifiedAssessments: 45200,
  pendingReviews: 342,
  highPotentialAthletes: 1205,
};
