import { Router } from "express";
import { body } from "express-validator";
import {
  createStripePaymentIntent,
  initializePaystackTransaction,
  listDonations,
  donationAnalytics,
  createManualDonation,
  updateDonationFlags,
} from "../controllers/donationController.js";
import { requireAdmin, requireSuperAdmin} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Public checkout endpoints (webhooks are mounted separately in server.js
// because they need raw body parsing)
router.post("/manual", requireAdmin, requireSuperAdmin, createManualDonation);
router.patch("/:id/flags", requireAdmin, requireSuperAdmin, updateDonationFlags);
router.post(
  "/stripe/intent",
  [body("amount").isInt({ min: 100 }), body("donorEmail").isEmail()],
  validate,
  createStripePaymentIntent
);

router.post(
  "/paystack/initialize",
  [body("amount").isInt({ min: 100 }), body("donorEmail").isEmail()],
  validate,
  initializePaystackTransaction
);

// Admin only
router.get("/", requireAdmin, listDonations);
router.get("/analytics", requireAdmin, donationAnalytics);

export default router;
