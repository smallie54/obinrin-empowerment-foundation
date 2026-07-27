import { Router } from "express";
import {
  listSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
  uploadSchoolImage,
  empowermentAnalytics,
} from "../controllers/schoolController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

// Public
router.get("/", listSchools);
router.get("/analytics", requireAdmin, empowermentAnalytics);
router.get("/:id", getSchool);

// Admin only
router.post("/", requireAdmin, createSchool);
router.patch("/:id", requireAdmin, updateSchool);
router.delete("/:id", requireAdmin, deleteSchool);
router.post(
  "/:id/images",
  requireAdmin,
  upload.single("image"),
  uploadSchoolImage
);

export default router;
