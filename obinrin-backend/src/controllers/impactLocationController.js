// controllers/impactLocationController.js
import ImpactLocation from "../models/impactLocation.js";

export async function listImpactLocations(req, res, next) {
  try {
    const locations = await ImpactLocation.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    next(err);
  }
}

export async function createImpactLocation(req, res, next) {
  try {
    const location = await ImpactLocation.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
}

export async function updateImpactLocation(req, res, next) {
  try {
    const location = await ImpactLocation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!location) return res.status(404).json({ message: "Impact location not found" });
    res.json(location);
  } catch (err) {
    next(err);
  }
}

export async function deleteImpactLocation(req, res, next) {
  try {
    const location = await ImpactLocation.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: "Impact location not found" });
    res.json({ message: "Impact location deleted" });
  } catch (err) {
    next(err);
  }
}

// Public — no auth. Only visible pins.
export async function publicImpactLocations(req, res, next) {
  try {
    const locations = await ImpactLocation.find({ visible: true }).select(
      "stateName latitude longitude girlsSupported schools volunteerTeams"
    );
    res.json(locations);
  } catch (err) {
    next(err);
  }
}