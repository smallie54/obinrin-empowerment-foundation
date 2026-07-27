import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";

export async function listEvents(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const events = await Event.find(filter).sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const idsToDelete = [
      event.coverImage?.publicId,
      ...event.gallery.map((g) => g.publicId),
    ].filter(Boolean);

    await Promise.all(idsToDelete.map((id) => cloudinary.uploader.destroy(id)));

    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadEventCover(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.coverImage?.publicId) {
      await cloudinary.uploader.destroy(event.coverImage.publicId);
    }

    event.coverImage = { url: req.file.path, publicId: req.file.filename };
    await event.save();

    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function uploadEventGalleryImage(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.gallery.push({
      url: req.file.path,
      publicId: req.file.filename,
      caption: req.body.caption || "",
    });
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}
