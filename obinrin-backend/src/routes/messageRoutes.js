// routes/messageRoutes.js
import { Router } from "express";
import { body } from "express-validator";
import {
  draftThankYouMessage,
  sendThankYouMessage,
  listRecentMessages,
  listMessages
} from "../controllers/messageController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// All routes require admin authentication
router.use(requireAdmin);

// List all messages with filters
router.get("/", listMessages);

// Get recent messages (last 10)
router.get("/recent", listRecentMessages);

// Draft a thank you message using AI
router.post(
  "/draft",
  [
    body("donorName").notEmpty().withMessage("Donor name is required"),
    body("amount").optional().isNumeric().withMessage("Amount must be a number"),
    body("currency").optional().isString().withMessage("Currency must be a string"),
    body("channel").optional().isIn(["email", "sms"]).withMessage("Channel must be email or sms")
  ],
  validate,
  draftThankYouMessage
);

// Send a thank you message
router.post(
  "/send",
  [
    body("donorEmail").isEmail().withMessage("Valid donor email is required"),
    body("donorName").notEmpty().withMessage("Donor name is required"),
    body("channel").isIn(["email", "sms"]).withMessage("Channel must be email or sms"),
    body("body").notEmpty().withMessage("Message body is required"),
    body("subject").optional().isString().withMessage("Subject must be a string")
  ],
  validate,
  sendThankYouMessage
);

export default router;