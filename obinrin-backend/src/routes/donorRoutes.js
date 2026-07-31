import { Router } from "express";
import {
  listDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
} from "../controllers/donorController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(requireAdmin); // donor CRM data is admin-only, no public routes

router.get("/", listDonors);
router.get("/:id", getDonor);
router.post("/", createDonor);
router.patch("/:id", updateDonor);
router.delete("/:id", deleteDonor);

export default router;
