import { Router } from "express";
import { body } from "express-validator";
import {
  draftThankYouMessage,
  sendThankYouMessage,
  listRecentMessages,
} from "../controllers/messageController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(requireAdmin); // all message actions are admin-only

router.post(
  "/draft",
  [body("donorName").notEmpty()],
  validate,
  draftThankYouMessage
);

router.post(
  "/send",
  [
    body("donorEmail").isEmail(),
    body("channel").isIn(["email", "sms"]),
    body("body").notEmpty(),
  ],
  validate,
  sendThankYouMessage
);

router.get("/recent", listRecentMessages);

export default router;