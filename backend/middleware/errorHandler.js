import { logEvents } from './logEvents.js';
import multer from 'multer';

export function errorHandler(err, req, res, next) {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  console.error(err.stack);
  
  // Handle multer errors specifically
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Too many files. Maximum 1 file per upload.' 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        message: 'Unexpected file field.' 
      });
    }
    return res.status(400).json({ 
      message: `Upload error: ${err.message}` 
    });
  }
  
  // Handle custom file validation errors
  if (err.message.includes('Only image files are allowed')) {
    return res.status(400).json({ 
      message: err.message 
    });
  }
  
  // Default error response
  res.status(500).json({ 
    message: 'Internal server error' 
  });
}

export default errorHandler;