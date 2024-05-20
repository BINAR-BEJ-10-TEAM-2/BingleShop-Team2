const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true,
});

const uploadToCloudinary = (fileBuffer, filename) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: 'image', use_filename: true, public_id: filename },
    (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    },
  );
  uploadStream.end(fileBuffer);
});

module.exports = { uploadToCloudinary };
