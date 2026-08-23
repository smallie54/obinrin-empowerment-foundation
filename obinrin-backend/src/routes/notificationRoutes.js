import { Router } from "express";
import {
  listNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(requireAdmin);

router.get("/", listNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;