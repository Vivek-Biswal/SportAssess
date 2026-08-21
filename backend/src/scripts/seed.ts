import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AssessmentTest } from '../models/AssessmentTest';
import { Benchmark } from '../models/Benchmark';

// Load environment variables from the root .env file
dotenv.config();

const seedData = [
  {
    name: 'Vertical Jump',
    category: 'Explosiveness',
    description: 'Measures explosive lower-body power.',
    measurementUnit: 'cm',
    difficulty: 'Intermediate',
    estimatedDurationMin: 5,
    aiVerificationAvailable: true,
  },
  {
    name: 'Football Juggling',
    category: 'Technical Skill',
    description: 'Measures football ball-control, coordination, consistency, and technical skill.',
    measurementUnit: 'touches',
    difficulty: 'Intermediate',
    estimatedDurationMin: 5,
    aiVerificationAvailable: true,
  },
  {
    name: 'Push-ups',
    category: 'Muscular Endurance',
    description: 'Measures upper-body muscular endurance.',
    measurementUnit: 'reps',
    difficulty: 'Beginner',
    estimatedDurationMin: 2,
    aiVerificationAvailable: true,
  },
  {
    name: 'Sit-ups',
    category: 'Core Endurance',
    description: 'Measures core endurance.',
    measurementUnit: 'reps',
    difficulty: 'Beginner',
    estimatedDurationMin: 2,
    aiVerificationAvailable: true,
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
    const pushUps = createdTests.find(t => t.name === 'Push-ups');
    
    if (verticalJump && pushUps) {
      const benchmarkData = [
        { testId: verticalJump._id, testName: verticalJump.name, ageGroup: '14-16', gender: 'Male', p50: 45, p75: 55, p90: 65, unit: 'cm' },
        { testId: verticalJump._id, testName: verticalJump.name, ageGroup: '14-16', gender: 'Female', p50: 35, p75: 45, p90: 55, unit: 'cm' },
        { testId: pushUps._id, testName: pushUps.name, ageGroup: '17-19', gender: 'Male', p50: 30, p75: 45, p90: 60, unit: 'reps' }, 
        { testId: pushUps._id, testName: pushUps.name, ageGroup: '17-19', gender: 'Female', p50: 15, p75: 25, p90: 35, unit: 'reps' },
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
