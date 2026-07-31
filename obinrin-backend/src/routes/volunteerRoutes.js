import { Router } from "express";
import { body } from "express-validator";
import {
  listVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  assignToOutreach,
  volunteerAnalytics,
} from "../controllers/volunteerController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Public — lets people apply to volunteer from the site without an account
router.post(
  "/apply",
  [body("name").notEmpty(), body("email").isEmail()],
  validate,
  createVolunteer
);

// Admin only
router.get("/", requireAdmin, listVolunteers);
router.get("/analytics", requireAdmin, volunteerAnalytics);
router.get("/:id", requireAdmin, getVolunteer);
router.patch("/:id", requireAdmin, updateVolunteer);
router.delete("/:id", requireAdmin, deleteVolunteer);
router.post("/:id/assign", requireAdmin, assignToOutreach);

export default router;
