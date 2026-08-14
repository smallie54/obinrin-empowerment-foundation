import cloudinary from "cloudinary";
import multer from "multer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cloudinaryStorageModule = require("multer-storage-cloudinary");

const CloudinaryStorage =
  cloudinaryStorageModule.CloudinaryStorage || cloudinaryStorageModule;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---- Images (unchanged) ----
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "obinrin-foundation",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, crop: "limit", quality: "auto" }],
  },
});

export const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

// ---- Videos (new) ----
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "obinrin-foundation/videos",
    resource_type: "video", // critical — without this, Cloudinary tries to process video files as images and rejects them
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB — videos are much bigger than images
});

export default cloudinary.v2;