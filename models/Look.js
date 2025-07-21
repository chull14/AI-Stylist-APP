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

  title: { type: String },
  imagePath: { 
    type: String, 
    required: true 
  },
  aesthetic: {
    type: String
  },
  tags: [String],
  notes: { 
    type: String 
  }, 

  sourceType: { 
    type: String, 
    enum: ['upload', 'AI'], 
    default: 'upload' 
  },

  savedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, { timestamps: true });

const Look = mongoose.model('Look', lookSchema);

export default Look;