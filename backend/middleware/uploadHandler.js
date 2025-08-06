import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Max 1 file per upload
  },
  fileFilter: (req, file, cb) => {
    // Check MIME type for images only
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 
      'image/webp', 'image/avif', 'image/gif'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed! Supported formats: JPEG, PNG, WebP, AVIF, GIF'), false);
    }
  }
});

export default upload;