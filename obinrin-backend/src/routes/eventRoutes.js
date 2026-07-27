import { Router } from "express";
import {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventCover,
  uploadEventGalleryImage,
} from "../controllers/eventController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

// Public
router.get("/", listEvents);
router.get("/:id", getEvent);

// Admin only
router.post("/", requireAdmin, createEvent);
router.patch("/:id", requireAdmin, updateEvent);
router.delete("/:id", requireAdmin, deleteEvent);
router.post(
  "/:id/cover",
  requireAdmin,
  upload.single("image"),
  uploadEventCover
);
router.post(
  "/:id/gallery",
  requireAdmin,
  upload.single("image"),
  uploadEventGalleryImage
);

export default router;
