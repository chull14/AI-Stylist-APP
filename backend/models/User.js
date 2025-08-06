import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },

  refreshToken: String,
  
  roles: {
    User: {
      type: Number,
      default: 2001
    },
    Editor: Number,
    Admin: Number
  },
  
  stylePreferences: {
    type: [String],
    default: [] // optional
  },
  favoriteBrands: {
    type: [String],
    default: [] // optional
  },
  
  myLooks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Look' 
  }],
  closet: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Closet' 
  }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;