// controllers/storyController.js
import Story from "../models/Story.js";
import cloudinary from "../config/cloudinary.js";

export async function listStories(req, res, next) {
  try {
    const { status, category, featured } = req.query;
    const filter = {};

    if (req.admin) {
      if (status) filter.status = status;
    } else {
      // Same rule as blog: no authenticated admin = published only,
      // no matter what the request asks for.
      filter.status = "published";
    }

    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;

    const stories = await Story.find(filter).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    next(err);
  }
}

export async function getStory(req, res, next) {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.status !== "published" && !req.admin) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(story);
  } catch (err) {
    next(err);
  }
}

export async function createStory(req, res, next) {
  try {
    const story = await Story.create({
      ...req.body,
      author: req.admin._id,
    });
    res.status(201).json(story);
  } catch (err) {
    next(err);
  }
}

export async function updateStory(req, res, next) {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (err) {
    next(err);
  }
}

export async function deleteStory(req, res, next) {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.coverImage?.publicId) {
      await cloudinary.uploader.destroy(story.coverImage.publicId);
    }
    if (story.avatarImage?.publicId) {
      await cloudinary.uploader.destroy(story.avatarImage.publicId);
    }

    res.json({ message: "Story deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadStoryCover(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.coverImage?.publicId) {
      await cloudinary.uploader.destroy(story.coverImage.publicId);
    }

    story.coverImage = { url: req.file.secure_url, publicId: req.file.public_id };
    await story.save();

    res.json(story);
  } catch (err) {
    next(err);
  }
}

export async function uploadStoryAvatar(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.avatarImage?.publicId) {
      await cloudinary.uploader.destroy(story.avatarImage.publicId);
    }

    story.avatarImage = { url: req.file.secure_url, publicId: req.file.public_id };
    await story.save();

    res.json(story);
  } catch (err) {
    next(err);
  }
}