const multer = require('multer');
const path = require('path');

/**
 * Image Check Configuration
 * @module imageCheck
 */

/**
 * Multer Configuration for Image Check
 * @constant {Object}
 * @property {Object} limits - Limits for file size
 * @property {number} limits.fileSize - Maximum file size allowed (in bytes)
 * @property {function} fileFilter - File filter function
 */
const imageCheck = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    cb(null, true);
  },
}).any();

module.exports = imageCheck;
