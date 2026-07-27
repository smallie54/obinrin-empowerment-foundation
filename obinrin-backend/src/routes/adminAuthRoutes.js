import { Router } from "express";
import { body } from "express-validator";
import {
  createAdmin,
  login,
  verifyTwoFactor,
  setupTwoFactor,
  enableTwoFactor,
  me,
} from "../controllers/adminAuthController.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Only an existing superadmin can create new admin accounts
router.post(
  "/create",
  requireAdmin,
  requireSuperAdmin,
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  validate,
  createAdmin
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  login
);

router.post(
  "/verify-2fa",
  [body("pendingToken").notEmpty(), body("code").isLength({ min: 6, max: 6 })],
  validate,
  verifyTwoFactor
);

router.post("/2fa/setup", requireAdmin, setupTwoFactor);
router.post(
  "/2fa/enable",
  requireAdmin,
  [body("code").isLength({ min: 6, max: 6 })],
  validate,
  enableTwoFactor
);

router.get("/me", requireAdmin, me);

export default router;
