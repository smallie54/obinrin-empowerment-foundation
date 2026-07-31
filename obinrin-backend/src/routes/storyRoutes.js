// routes/storyRoutes.js
import { Router } from "express";
import { body } from "express-validator";
import {
  listStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  uploadStoryCover,
  uploadStoryAvatar,
} from "../controllers/storyController.js";
import { requireAdmin, requireSuperAdmin, attachAdminIfPresent } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.get("/", attachAdminIfPresent, listStories);
router.get("/:id", attachAdminIfPresent, getStory);

router.post(
  "/",
  requireAdmin,
  [body("title").notEmpty(), body("category").notEmpty()],
  validate,
  createStory
);
router.patch("/:id", requireAdmin, updateStory);
router.delete("/:id", requireAdmin, requireSuperAdmin, deleteStory);
router.post("/:id/cover", requireAdmin, upload.single("image"), uploadStoryCover);
router.post("/:id/avatar", requireAdmin, upload.single("image"), uploadStoryAvatar);

export default router;