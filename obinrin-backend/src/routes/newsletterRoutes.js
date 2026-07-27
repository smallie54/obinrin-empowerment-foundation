import { Router } from "express";
import { body } from "express-validator";
import {
  subscribe,
  unsubscribe,
  listSubscribers,
  broadcastNewsletter,
} from "../controllers/newsletterController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Public
router.post(
  "/subscribe",
  [body("email").isEmail()],
  validate,
  subscribe
);
router.get("/unsubscribe/:token", unsubscribe);

// Admin only
router.get("/subscribers", requireAdmin, listSubscribers);
router.post(
  "/broadcast",
  requireAdmin,
  [body("subject").notEmpty(), body("html").notEmpty()],
  validate,
  broadcastNewsletter
);

export default router;
