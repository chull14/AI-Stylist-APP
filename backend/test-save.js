import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Look from './models/Look.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const testSaveFunctionality = async () => {
  await connectDB();
  
  try {
    // Get a user and a look
    const user = await User.findOne({});
    const look = await Look.findOne({});
    
    if (!user || !look) {
      console.log('No user or look found');
      return;
    }
    
    console.log('Testing save functionality:');
    console.log('User ID:', user._id);
    console.log('Look ID:', look._id);
    console.log('Look title:', look.title);
    console.log('Current savedBy:', look.savedBy);
    
    // Test saving the look
    if (!look.savedBy) look.savedBy = [];
    look.savedBy.push(user._id);
    await look.save();
    
    console.log('After saving - savedBy:', look.savedBy);
    
    // Test finding saved looks
    const savedLooks = await Look.find({ savedBy: user._id });
    console.log('Saved looks for user:', savedLooks.length);
    savedLooks.forEach(l => console.log('-', l.title));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testSaveFunctionality(); 