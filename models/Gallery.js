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
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;