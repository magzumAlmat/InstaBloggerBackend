const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for video
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mov|quicktime|octet-stream/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype || extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images and video (MP4, MOV)!"));
  }
});

module.exports = upload;
