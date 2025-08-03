import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/dbConn.js';
import { logger } from './middleware/logEvents.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/api/auth.js';
import userRoutes from './routes/api/users.js';
import galleryRoutes from './routes/api/galleries.js';
import lookRoutes from './routes/api/looks.js';
import closetRoutes from './routes/api/closet.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// custome middleware logger
app.use(logger);

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// auth routes
app.use('/api', authRoutes);

// verified routes
app.use('/api/users/:userId', userRoutes);
app.use('/api/users/:userId/galleries', galleryRoutes);
app.use('/api/users/:userId/looks', lookRoutes);
app.use('/api/users/:userId/closet', closetRoutes);

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
