const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  secure: true,
});

const uploadToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, { use_filename: true });
    fs.unlinkSync(filepath);
    return result.url;
  } catch (err) {
    fs.unlinkSync(filepath);
    return null;
  }
};

module.exports = { uploadToCloudinary };
