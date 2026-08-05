import Program from "../models/Program.js";
import cloudinary from "../config/cloudinary.js";

export async function listPrograms(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const programs = await Program.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(programs);
  } catch (err) {
    next(err);
  }
}

export async function getProgram(req, res, next) {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (err) {
    next(err);
  }
}

export async function createProgram(req, res, next) {
  try {
    const program = await Program.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
}

export async function updateProgram(req, res, next) {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (err) {
    next(err);
  }
}

export async function deleteProgram(req, res, next) {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });

    if (program.coverImage?.publicId) {
      await cloudinary.uploader.destroy(program.coverImage.publicId);
    }

    res.json({ message: "Program deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadProgramCover(req, res, next) {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });

    if (program.coverImage?.publicId) {
      await cloudinary.uploader.destroy(program.coverImage.publicId);
    }

    program.coverImage = { url: req.file.path, publicId: req.file.filename };
    await program.save();

    res.json(program);
  } catch (err) {
    next(err);
  }
}