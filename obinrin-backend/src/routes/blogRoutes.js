import { Router } from "express";
import { body } from "express-validator";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostCover,
} from "../controllers/blogController.js";
import { requireAdmin,requireSuperAdmin,attachAdminIfPresent } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.get("/", listPosts);
router.get("/:id", getPost);

router.post("/", requireAdmin, [body("title").notEmpty(), body("content").notEmpty()], validate, createPost);
router.patch("/:id", requireAdmin, updatePost);
router.delete("/:id", requireAdmin, requireSuperAdmin, deletePost);
router.post("/:id/cover", requireAdmin, upload.single("image"), uploadPostCover);
router.get("/", attachAdminIfPresent, listPosts);
export default router;