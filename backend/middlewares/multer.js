import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // You can use any temp folder or skip this for direct cloudinary upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Alternative: Use memory storage for direct cloudinary upload (recommended)
const memoryStorage = multer.memoryStorage();

export const upload = multer({ 
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    // Always accept, let controller handle validation
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
