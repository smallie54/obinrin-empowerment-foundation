import Volunteer from "../models/Volunteer.js";
import Outreach from "../models/Outreach.js";
import { createNotification } from "./notificationController.js";

export async function listVolunteers(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const volunteers = await Volunteer.find(filter).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (err) {
    next(err);
  }
}

export async function getVolunteer(req, res, next) {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate(
      "assignedOutreach",
      "title status eventDate"
    );
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    res.json(volunteer);
  } catch (err) {
    next(err);
  }
}

export async function createVolunteer(req, res, next) {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
    await createNotification({
      message: `New volunteer application from ${volunteer.name}`,
      type: "volunteer",
      link: "/admin/volunteers",
    });
  } catch (err) {
    next(err);
  }
}

export async function updateVolunteer(req, res, next) {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    res.json(volunteer);
  } catch (err) {
    next(err);
  }
}

export async function deleteVolunteer(req, res, next) {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    res.json({ message: "Volunteer deleted" });
  } catch (err) {
    next(err);
  }
}

// Assigns a volunteer to an outreach event and keeps both sides of the
// relationship in sync.
export async function assignToOutreach(req, res, next) {
  try {
    const { outreachId } = req.body;

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    const outreach = await Outreach.findById(outreachId);
    if (!outreach) return res.status(404).json({ message: "Outreach not found" });

    if (!volunteer.assignedOutreach.includes(outreachId)) {
      volunteer.assignedOutreach.push(outreachId);
      volunteer.status = "assigned";
      await volunteer.save();
    }

    if (!outreach.volunteersAssigned.includes(volunteer._id)) {
      outreach.volunteersAssigned.push(volunteer._id);
      await outreach.save();
    }

    res.json(volunteer);
  } catch (err) {
    next(err);
  }
}

export async function volunteerAnalytics(req, res, next) {
  try {
    const [byStatus, total] = await Promise.all([
      Volunteer.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Volunteer.countDocuments(),
    ]);
    res.json({ total, byStatus });
  } catch (err) {
    next(err);
  }
}
