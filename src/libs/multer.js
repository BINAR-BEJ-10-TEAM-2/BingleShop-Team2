const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads")
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})
  
const fileFilter = function(req, file, callback) {
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
        return callback(null, true)
    } 
    return callback(new Error("File type must be .jpeg, .jpg or .png"))
  }
  
const upload = multer({storage : storage, fileFilter});

module.exports = {upload};