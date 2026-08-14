// controllers/videoController.js
import Video from "../models/Video.js";
import cloudinary from "../config/cloudinary.js";

export async function listVideos(req, res, next) {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    next(err);
  }
}

export async function createVideo(req, res, next) {
  try {
    const video = await Video.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
}

export async function updateVideo(req, res, next) {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    next(err);
  }
}

export async function deleteVideo(req, res, next) {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploadedVideo?.publicId) {
      await cloudinary.uploader.destroy(video.uploadedVideo.publicId, { resource_type: "video" });
    }
    if (video.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(video.thumbnail.publicId);
    }

    res.json({ message: "Video deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadVideoFile(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No video uploaded" });

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploadedVideo?.publicId) {
      await cloudinary.uploader.destroy(video.uploadedVideo.publicId, { resource_type: "video" });
    }

    video.uploadedVideo = { url: req.file.secure_url, publicId: req.file.public_id };
    video.sourceType = "upload";
    await video.save();

    res.json(video);
  } catch (err) {
    next(err);
  }
}

export async function uploadVideoThumbnail(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(video.thumbnail.publicId);
    }

    video.thumbnail = { url: req.file.secure_url, publicId: req.file.public_id };
    await video.save();

    res.json(video);
  } catch (err) {
    next(err);
  }
}

// Public — only the featured, published video (what VideoStory shows)
export async function publicFeaturedVideo(req, res, next) {
  try {
    const video = await Video.findOne({ status: "published", featured: true });
    res.json(video || null);
  } catch (err) {
    next(err);
  }
}