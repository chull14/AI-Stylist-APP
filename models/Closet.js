import mongoose from 'mongoose';
const { Schema } = mongoose;

const closetItemSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  imagePath: {
    type: String,
    required: true
  },
  name: { type: String },
  aesthetic: [String],
  colors: [String],
  brand: { type: String },
  notes: { type: String },
  tags: [String],
  sourceType: {
    type: String,
    enum: ['upload'],
    default: 'upload'
  },
}, { timestamps: true });

const Closet = mongoose.model('Closet', closetItemSchema);

export default Closet;