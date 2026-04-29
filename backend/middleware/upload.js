const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const makeStorage = (folder, transform) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `coffesino/${folder}`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: transform ? [transform] : undefined
  }
});

exports.uploadMenuItem = multer({ storage: makeStorage('menu', { width: 800, height: 600, crop: 'fill' }) });
exports.uploadTable    = multer({ storage: makeStorage('tables', { width: 600, height: 400, crop: 'fill' }) });
exports.uploadPayment  = multer({ storage: makeStorage('payments') });
exports.cloudinary     = cloudinary;
