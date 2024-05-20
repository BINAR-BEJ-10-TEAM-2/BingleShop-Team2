const multer = require('multer');

const storage = multer.memoryStorage();
const fileFilter = function (req, file, callback) {
  if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
    return callback(null, true);
  }
  return callback(new Error('File type must be .jpeg, .jpg or .png'));
};

const upload = multer({ storage: storage, fileFilter });
const uploadItemImage = upload.single('item_image');

module.exports = { uploadItemImage };
