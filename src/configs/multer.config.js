"use strict";

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Get the absolute path to the upload directory, using normalized paths for cross-platform compatibility
const dir = path.resolve(__dirname, "../upload");
console.log(`Configured upload directory: ${dir}`);
console.log(`Running on OS: ${os.platform()} ${os.release()}`);
console.log(`Node.js version: ${process.version}`);

// Create temporary directory as fallback in case the configured directory has issues
let uploadDir = dir;
const tempDir = path.join(os.tmpdir(), 'app-uploads');

// Ensure upload directory exists and is writable
try {
  if (!fs.existsSync(dir)) {
    console.log(`Upload directory doesn't exist, creating: ${dir}`);
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    console.log(`Upload directory created: ${dir}`);
  }

  // Test write permissions by creating and removing a test file
  const testFile = path.join(dir, '.test-write-permissions');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log(`✓ Upload directory ${dir} is writable`);
} catch (err) {
  console.error(`Error with primary upload directory: ${err.message}`);

  // Fallback to system temporary directory
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true, mode: 0o755 });
    }
    const tempTestFile = path.join(tempDir, '.test-write-permissions');
    fs.writeFileSync(tempTestFile, 'test');
    fs.unlinkSync(tempTestFile);

    console.log(`⚠️ Falling back to system temporary directory: ${tempDir}`);
    uploadDir = tempDir;
  } catch (tempErr) {
    console.error(`Critical error: Cannot create or write to any upload directory!`);
    console.error(`Original error: ${err.message}`);
    console.error(`Fallback error: ${tempErr.message}`);
    console.error(`Make sure the application has write permissions to either:`);
    console.error(`1. Configured path: ${dir}`);
    console.error(`2. System temp path: ${tempDir}`);
  }
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/mkv",
  "video/webm",
  "video/mpeg",
  "video/quicktime"
];

const allowedExtensions = /\.(jpeg|jpg|png|gif|mp4|mkv|mov|webm|mpeg)$/i;

const fileFilter = (req, file, cb) => {
  const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
  const isExtAllowed = allowedExtensions.test(path.extname(file.originalname));

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use the potentially updated uploadDir (which might be the temp directory if main dir had issues)
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize the original filename to avoid issues with special characters
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix + path.extname(sanitizedName);

    console.log(`Creating file: ${filename} in ${uploadDir}`);
    cb(null, filename);
  },
});

const uploadDisk = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
  fileFilter: fileFilter
});

// Custom middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'File size exceeds the 50MB limit'
      });
    }
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: `Upload error: ${err.message}`
    });
  }

  if (err) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: err.message || 'Unknown upload error'
    });
  }

  next();
};

module.exports = { uploadDisk, handleMulterError };
