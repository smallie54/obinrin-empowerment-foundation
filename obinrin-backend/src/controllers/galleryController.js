import GalleryImage from "../models/GalleryImage.js";
import cloudinary from "../config/cloudinary.js";

export async function listGalleryImages(req, res, next) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
}

export async function uploadGalleryImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const image = await GalleryImage.create({
      url: req.file.secure_url,
      publicId: req.file.public_id,
      caption: req.body.caption || "",
      category: req.body.category || "outreach",
      uploadedBy: req.admin._id,
    });

    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
}

export async function updateGalleryImage(req, res, next) {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { caption: req.body.caption, category: req.body.category },
      { new: true, runValidators: true }
    );
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (err) {
    next(err);
  }
}

export async function deleteGalleryImage(req, res, next) {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await cloudinary.uploader.destroy(image.publicId);

    res.json({ message: "Image deleted" });
  } catch (err) {
    next(err);
  }
}