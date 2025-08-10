import mongoose from 'mongoose';
const { Schema } = mongoose;

const gallerySchema = new Schema({
  title: {
    type: String,
    required: true
  }, 
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    default: []
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  followers: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;