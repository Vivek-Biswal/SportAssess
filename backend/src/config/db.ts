import mongoose from 'mongoose';

// Track the connection status to prevent creating multiple connections in serverless environments
let isConnected = false; 

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is missing in environment variables');
    throw new Error('DATABASE_URL is not defined.');
  }

  try {
    const db = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log(`=> newly connected to database: ${db.connection.host}`);
  } catch (error) {
    console.error('=> error connecting to database:', error);
    throw error;
  }
};
