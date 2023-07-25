"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const cloudinary_1 = require("cloudinary/");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const params = {
    folder: "support-system",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "pdf"],
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params,
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB file size limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname
            .toLowerCase()
            .match(/\.(jpg|jpeg|png|gif|mp4|mov|pdf)$/)) {
            return cb(new Error("Only images, pdfs and videos are allowed."));
        }
        cb(null, true);
    },
});
