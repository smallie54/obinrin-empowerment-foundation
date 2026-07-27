import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import webhookRoutes from "./routes/webhookRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Webhooks must be mounted BEFORE express.json() for Stripe's raw-body
// signature check to work. Paystack's route also needs the raw body
// captured, done via the `verify` option below.
app.use("/api/webhooks", webhookRoutes);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // used by the Paystack webhook signature check
    },
  })
);

// Basic rate limiting on auth routes to slow brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later" },
});

app.use("/api/admin/auth", authLimiter, adminAuthRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
