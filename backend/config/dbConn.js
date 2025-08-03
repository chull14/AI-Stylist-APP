import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('DATABASE_URI:', process.env.DATABASE_URI);
    if (!process.env.DATABASE_URI) {
      throw new Error('DATABASE_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

export default connectDB;