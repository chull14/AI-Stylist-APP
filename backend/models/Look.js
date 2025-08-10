import mongoose from 'mongoose';
const { Schema } = mongoose;

const lookSchema = new Schema({
  galleryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gallery',
    default: null
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  title: { 
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: { 
    type: String,
    default: null
  },
  imagePath: { 
    type: String,
    default: null
  },
  style: {
    type: String,
    default: 'Casual'
  },
  occasion: {
    type: String,
    default: 'Everyday'
  },
  items: [{
    type: String,
    default: []
  }],
  aesthetic: [String],
  tags: [String],
  notes: { type: String }, 
  season: {
    type: String,
    default: 'All Season'
  },
  colorPreference: {
    type: String,
    default: 'Neutral'
  },

  sourceType: { 
    type: String, 
    enum: ['upload', 'saved', 'AI'], 
    default: 'saved' 
  },

  savedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  isLiked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Look = mongoose.model('Look', lookSchema);

export default Look;