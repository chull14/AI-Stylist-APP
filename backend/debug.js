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

const debugDatabase = async () => {
  await connectDB();
  
  try {
    // Check all looks
    const allLooks = await Look.find({});
    console.log('\n=== ALL LOOKS ===');
    console.log('Total looks:', allLooks.length);
    allLooks.forEach((look, index) => {
      console.log(`${index + 1}. ID: ${look._id}`);
      console.log(`   Title: ${look.title}`);
      console.log(`   User: ${look.userId}`);
      console.log(`   LikedBy: ${look.likedBy?.length || 0} users`);
      console.log(`   SavedBy: ${look.savedBy?.length || 0} users`);
      console.log(`   SavedBy IDs:`, look.savedBy || []);
      console.log('---');
    });

    // Check all users
    const allUsers = await User.find({});
    console.log('\n=== ALL USERS ===');
    console.log('Total users:', allUsers.length);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

debugDatabase(); 