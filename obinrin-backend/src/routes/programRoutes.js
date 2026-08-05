import { Router } from "express";
import { body } from "express-validator";
import {
  listPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  uploadProgramCover,
} from "../controllers/programController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.get("/", listPrograms);
router.get("/:id", getProgram);

router.post(
  "/",
  requireAdmin,
  [body("name").notEmpty(), body("description").notEmpty()],
  validate,
  createProgram
);
router.patch("/:id", requireAdmin, updateProgram);
router.delete("/:id", requireAdmin, deleteProgram);
router.post("/:id/cover", requireAdmin, upload.single("image"), uploadProgramCover);

export default router;