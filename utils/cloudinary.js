const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'support-system',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf']
    }
});

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB file size limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|mp4|mov|pdf)$/)) {
            return cb(new Error('Only images, pdfs and videos are allowed.'));
        }
        cb(null, true);
    }
});

// export default upload;
