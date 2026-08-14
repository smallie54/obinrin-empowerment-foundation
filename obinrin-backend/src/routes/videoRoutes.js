// routes/videoRoutes.js
import { Router } from "express";
import {
  listVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  uploadVideoFile,
  uploadVideoThumbnail,
  publicFeaturedVideo,
} from "../controllers/videoController.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.get("/public/featured", publicFeaturedVideo);

router.get("/", requireAdmin, listVideos);
router.post("/", requireAdmin, createVideo);
router.patch("/:id", requireAdmin, updateVideo);
router.delete("/:id", requireAdmin, requireSuperAdmin, deleteVideo);
router.post("/:id/video-file", requireAdmin, upload.single("video"), uploadVideoFile);
router.post("/:id/thumbnail", requireAdmin, upload.single("image"), uploadVideoThumbnail);

export default router;