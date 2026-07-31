import BlogPost from "../models/BlogPost.js";
import cloudinary from "../config/cloudinary.js";

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function listPosts(req, res, next) {
  try {
    const { status, category } = req.query;
    const filter = {};

    if (req.admin) {
      if (status) filter.status = status;
    } else {

      filter.status = "published";
    }

    if (category) filter.category = category;
    const posts = await BlogPost.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const { title, status } = req.body;
    let slug = slugify(title);

    const existing = await BlogPost.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const post = await BlogPost.create({
      ...req.body,
      slug,
      author: req.admin._id,
      publishedAt: status === "published" ? new Date() : undefined,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const update = { ...req.body };

    if (update.status === "published") {
      const existing = await BlogPost.findById(req.params.id);
      if (existing && !existing.publishedAt) {
        update.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.coverImage?.publicId) {
      await cloudinary.uploader.destroy(post.coverImage.publicId);
    }

    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}
export async function uploadPostCover(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.coverImage?.publicId) {
      await cloudinary.uploader.destroy(post.coverImage.publicId);
    }

    post.coverImage = { url: req.file.secure_url, publicId: req.file.public_id };
    await post.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
}