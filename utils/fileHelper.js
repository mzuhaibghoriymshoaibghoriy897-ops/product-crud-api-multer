const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Accepts a bare filename ("123.jpg") or a stored path ("uploads/123.jpg")
const deleteFile = (fileOrPath) => {
  if (!fileOrPath) return;
  try {
    // basename() makes sure we can only ever delete files inside /uploads
    const filePath = path.join(UPLOAD_DIR, path.basename(fileOrPath));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("File delete error:", error.message);
  }
};

module.exports = { deleteFile };
