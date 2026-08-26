import { Router } from "express";
import { checkOutreachReminders } from "../controllers/internalController.js";
import { verifyCronSecret } from "../middleware/verifyCronSecret.js";

const router = Router();

router.post("/check-outreach-reminders", verifyCronSecret, checkOutreachReminders);

export default router;