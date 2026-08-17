import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AssessmentTest } from '../models/AssessmentTest';
import { Benchmark } from '../models/Benchmark';

// Load environment variables from the root .env file
dotenv.config();

const seedData = [
  {
    name: 'Height',
    category: 'Anthropometric',
    description: 'Measures the standing height of the athlete.',
    measurementUnit: 'cm',
    difficulty: 'Beginner',
    estimatedDurationMin: 2,
    aiVerificationAvailable: false,
  },
  {
    name: 'Weight',
    category: 'Anthropometric',
    description: 'Measures the body mass of the athlete.',
    measurementUnit: 'kg',
    difficulty: 'Beginner',
    estimatedDurationMin: 2,
    aiVerificationAvailable: false,
  },
  {
    name: 'Vertical Jump',
    category: 'Explosiveness',
    description: 'Measures explosive lower-body power. AI detects takeoff/landing movement and estimates jump performance.',
    measurementUnit: 'cm',
    difficulty: 'Intermediate',
    estimatedDurationMin: 5,
    aiVerificationAvailable: true,
  },
  {
    name: 'Shuttle Run',
    category: 'Agility',
    description: 'Measures agility and speed. AI-assisted timing and movement analysis.',
    measurementUnit: 'sec',
    difficulty: 'Intermediate',
    estimatedDurationMin: 10,
    aiVerificationAvailable: true,
  },
  {
    name: 'Sit-Ups (1 Min)',
    category: 'Core Endurance',
    description: 'Measures core endurance. AI assists with repetition counting and movement verification.',
    measurementUnit: 'reps',
    difficulty: 'Beginner',
    estimatedDurationMin: 2,
    aiVerificationAvailable: true,
  },
  {
    name: 'Endurance Run',
    category: 'Cardiovascular',
    description: 'Measures cardiovascular endurance over a set distance.',
    measurementUnit: 'min',
    difficulty: 'Advanced',
    estimatedDurationMin: 20,
    aiVerificationAvailable: false,
  }
];

const seedDatabase = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined in .env');
    }

    console.log('Connecting to database...');
    await mongoose.connect(dbUrl);
    console.log('Connected to database.');

    console.log('Clearing existing assessment tests and benchmarks...');
    await AssessmentTest.deleteMany({});
    await Benchmark.deleteMany({});
    
    console.log('Inserting seed data...');
    const createdTests = await AssessmentTest.insertMany(seedData);
    
    // Seed Benchmarks
    const verticalJump = createdTests.find(t => t.name === 'Vertical Jump');
    const shuttleRun = createdTests.find(t => t.name === 'Shuttle Run');
    
    if (verticalJump && shuttleRun) {
      const benchmarkData = [
        { testId: verticalJump._id, testName: verticalJump.name, ageGroup: '14-16', gender: 'Male', p50: 45, p75: 55, p90: 65, unit: 'cm' },
        { testId: verticalJump._id, testName: verticalJump.name, ageGroup: '14-16', gender: 'Female', p50: 35, p75: 45, p90: 55, unit: 'cm' },
        { testId: shuttleRun._id, testName: shuttleRun.name, ageGroup: '17-19', gender: 'Male', p50: 5.2, p75: 4.8, p90: 4.5, unit: 'sec' }, // Note lower is better for time
        { testId: shuttleRun._id, testName: shuttleRun.name, ageGroup: '17-19', gender: 'Female', p50: 6.0, p75: 5.5, p90: 5.0, unit: 'sec' },
      ];
      await Benchmark.insertMany(benchmarkData);
      console.log('Inserted benchmark data');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
