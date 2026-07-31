import Partnership from "../models/Partnership.js";
import cloudinary from "../config/cloudinary.js";

export async function listPartnerships(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const partnerships = await Partnership.find(filter).sort({ createdAt: -1 });
    res.json(partnerships);
  } catch (err) {
    next(err);
  }
}

export async function getPartnership(req, res, next) {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ message: "Partnership not found" });
    res.json(partnership);
  } catch (err) {
    next(err);
  }
}

export async function createPartnership(req, res, next) {
  try {
    const partnership = await Partnership.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(partnership);
  } catch (err) {
    next(err);
  }
}

export async function updatePartnership(req, res, next) {
  try {
    const partnership = await Partnership.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!partnership) return res.status(404).json({ message: "Partnership not found" });
    res.json(partnership);
  } catch (err) {
    next(err);
  }
}

export async function deletePartnership(req, res, next) {
  try {
    const partnership = await Partnership.findByIdAndDelete(req.params.id);
    if (!partnership) return res.status(404).json({ message: "Partnership not found" });

    if (partnership.logo?.publicId) {
      await cloudinary.uploader.destroy(partnership.logo.publicId);
    }

    res.json({ message: "Partnership deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadPartnershipLogo(req, res, next) {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ message: "Partnership not found" });

    if (partnership.logo?.publicId) {
      await cloudinary.uploader.destroy(partnership.logo.publicId);
    }

    partnership.logo = { url: req.file.path, publicId: req.file.filename };
    await partnership.save();

    res.json(partnership);
  } catch (err) {
    next(err);
  }
}
