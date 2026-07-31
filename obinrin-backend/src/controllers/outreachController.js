import Outreach from "../models/Outreach.js";

export async function listOutreach(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const outreach = await Outreach.find(filter)
      .populate("volunteersAssigned", "name email")
      .sort({ createdAt: -1 });
    res.json(outreach);
  } catch (err) {
    next(err);
  }
}

// Grouped by status — exactly the shape the kanban board needs, so the
// frontend doesn't have to bucket the flat list itself.
export async function boardView(req, res, next) {
  try {
    const items = await Outreach.find()
      .populate("volunteersAssigned", "name")
      .sort({ createdAt: -1 });

    const board = {
      idea: [],
      planning: [],
      scheduled: [],
      "in-progress": [],
      completed: [],
    };

    for (const item of items) {
      board[item.status]?.push(item);
    }

    res.json(board);
  } catch (err) {
    next(err);
  }
}

export async function getOutreach(req, res, next) {
  try {
    const outreach = await Outreach.findById(req.params.id).populate(
      "volunteersAssigned",
      "name email"
    );
    if (!outreach) return res.status(404).json({ message: "Outreach not found" });
    res.json(outreach);
  } catch (err) {
    next(err);
  }
}

export async function createOutreach(req, res, next) {
  try {
    const outreach = await Outreach.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(outreach);
  } catch (err) {
    next(err);
  }
}

export async function updateOutreach(req, res, next) {
  try {
    const outreach = await Outreach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!outreach) return res.status(404).json({ message: "Outreach not found" });
    res.json(outreach);
  } catch (err) {
    next(err);
  }
}

// Dedicated endpoint for kanban drag-and-drop — just moves the status,
// so the frontend doesn't need to resend the whole record on every drag.
export async function moveOutreachStatus(req, res, next) {
  try {
    const { status } = req.body;
    const outreach = await Outreach.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!outreach) return res.status(404).json({ message: "Outreach not found" });
    res.json(outreach);
  } catch (err) {
    next(err);
  }
}

export async function deleteOutreach(req, res, next) {
  try {
    const outreach = await Outreach.findByIdAndDelete(req.params.id);
    if (!outreach) return res.status(404).json({ message: "Outreach not found" });
    res.json({ message: "Outreach deleted" });
  } catch (err) {
    next(err);
  }
}

export async function upcomingCount(req, res, next) {
  try {
    const count = await Outreach.countDocuments({
      status: { $in: ["planning", "scheduled", "in-progress"] },
    });
    res.json({ count });
  } catch (err) {
    next(err);
  }
}
