// routes/impactLocationRoutes.js
import { Router } from "express";
import {
  listImpactLocations,
  createImpactLocation,
  updateImpactLocation,
  deleteImpactLocation,
  publicImpactLocations,
} from "../controllers/impactLocationController.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", publicImpactLocations);

router.get("/", requireAdmin, listImpactLocations);
router.post("/", requireAdmin, createImpactLocation);
router.patch("/:id", requireAdmin, updateImpactLocation);
router.delete("/:id", requireAdmin, requireSuperAdmin, deleteImpactLocation);

export default router;