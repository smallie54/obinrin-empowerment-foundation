import { Router } from "express";
import { body } from "express-validator";
import {
  listOutreach,
  boardView,
  getOutreach,
  createOutreach,
  updateOutreach,
  moveOutreachStatus,
  deleteOutreach,
  upcomingCount,
} from "../controllers/outreachController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(requireAdmin); // outreach planning is internal-only

router.get("/", listOutreach);
router.get("/board", boardView);
router.get("/upcoming-count", upcomingCount);
router.get("/:id", getOutreach);
router.post("/", [body("title").notEmpty()], validate, createOutreach);
router.patch("/:id", updateOutreach);
router.patch(
  "/:id/status",
  [
    body("status").isIn([
      "idea",
      "planning",
      "scheduled",
      "in-progress",
      "completed",
    ]),
  ],
  validate,
  moveOutreachStatus
);
router.delete("/:id", deleteOutreach);

export default router;
