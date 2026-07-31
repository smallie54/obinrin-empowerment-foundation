import { Router } from "express";
import {
  listGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.get("/", listGalleryImages);

router.post("/", requireAdmin, upload.single("image"), uploadGalleryImage);
router.patch("/:id", requireAdmin, updateGalleryImage);
router.delete("/:id", requireAdmin, requireSuperAdmin, deleteGalleryImage);

export default router;