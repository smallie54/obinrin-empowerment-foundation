import "dotenv/config";
import dns from "dns";


dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import messageRoutes from "./routes/messageRoutes.js";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import webhookRoutes from "./routes/webhookRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import partnershipRoutes from "./routes/partnershipRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import outreachRoutes from "./routes/outreachRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import storiesRoutes from "./routes/storyRoutes.js"
import programRoutes from "./routes/programRoutes.js";
import impactLocationRoutes from "./routes/impactLocationRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import internalRoutes from "./routes/internalRoutes.js";
const app = express();

app.use("/api/internal", internalRoutes);
app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const vercelPreviewPattern = process.env.VERCEL_PROJECT_PREFIX
  ? new RegExp(`^https://${process.env.VERCEL_PROJECT_PREFIX}.*\\.vercel\\.app$`)
  : null;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");
      const isExactMatch = allowedOrigins.includes(cleanOrigin);
      const isVercelPreview = vercelPreviewPattern?.test(cleanOrigin);

      if (isExactMatch || isVercelPreview) {
        return callback(null, true);
      }

      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.set("trust proxy", 1);


app.use("/api/webhooks", webhookRoutes);
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; 
    },
  })
);


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
app.use("/api/donors", donorRoutes);
app.use("/api/partnerships", partnershipRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/outreach", outreachRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/blog", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/impact-locations", impactLocationRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
