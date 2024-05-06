const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    secure : true
  })
  
const uploadToCloudinary = async (filepath) => {
    let result;
    try {
        result = await cloudinary.uploader.upload(filepath, {use_filename: true})
    } catch (error) {   
        console.error(err.stack);
    } finally {
        fs.unlinkSync(filepath);
    }
}

module.exports = {uploadToCloudinary}