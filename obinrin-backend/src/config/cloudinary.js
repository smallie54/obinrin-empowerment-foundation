import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cloudinaryStorageModule = require("multer-storage-cloudinary");

// Different versions of this package export the class differently:
// newer versions expose { CloudinaryStorage }, older versions export
// the class itself as module.exports. Handle both.
const CloudinaryStorage =
  cloudinaryStorageModule.CloudinaryStorage || cloudinaryStorageModule;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "obinrin-foundation",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, crop: "limit", quality: "auto" }],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

export default cloudinary;