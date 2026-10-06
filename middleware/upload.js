const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute path so it works no matter where `node server.js` is started from
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg"];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // all images go into the uploads/ folder
  },
  filename: (req, file, cb) => {
    // Unique filename so two uploads never overwrite each other
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase(); // .jpg
    cb(null, uniqueName + ext); // e.g. 1788856108020-472839201.jpg
  },
});

// File filter: only .png, .jpg, .jpeg are allowed
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true); // allow
  } else {
    const error = new Error("Only .png, .jpg and .jpeg image files are allowed");
    error.status = 400;
    cb(error, false); // reject
  }
};

// Reusable multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: fileFilter,
});

module.exports = upload;
