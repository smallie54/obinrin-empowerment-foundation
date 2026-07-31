import { Router } from "express";
import {
  listPartnerships,
  getPartnership,
  createPartnership,
  updatePartnership,
  deletePartnership,
  uploadPartnershipLogo,
} from "../controllers/partnershipController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

// Public — partnerships/sponsor logos can be shown on the marketing site
router.get("/", listPartnerships);
router.get("/:id", getPartnership);

// Admin only
router.post("/", requireAdmin, createPartnership);
router.patch("/:id", requireAdmin, updatePartnership);
router.delete("/:id", requireAdmin, deletePartnership);
router.post(
  "/:id/logo",
  requireAdmin,
  upload.single("image"),
  uploadPartnershipLogo
);

export default router;
