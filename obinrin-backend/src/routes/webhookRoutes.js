import { Router } from "express";
import express from "express";
import { stripeWebhook, paystackWebhook } from "../controllers/donationController.js";

const router = Router();

// Stripe needs the raw, unparsed body for signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Paystack: verify signature against the raw body captured in server.js
router.post("/paystack", paystackWebhook);

export default router;
