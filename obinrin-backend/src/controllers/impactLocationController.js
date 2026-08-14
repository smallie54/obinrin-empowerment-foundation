// controllers/impactLocationController.js
import ImpactLocation from "../models/impactLocation.js";
import School from "../models/School.js";
import Outreach from "../models/Outreach.js";

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

// Public — computes real stats per pin from School and Outreach/Volunteer
// data, instead of relying on manually duplicated numbers.
export async function publicImpactLocations(req, res, next) {
  try {
    const locations = await ImpactLocation.find({ visible: true });

    const enriched = await Promise.all(
      locations.map(async (loc) => {
        // Girls supported + school count: schools whose region matches this pin's state
        const schoolStats = await School.aggregate([
          { $match: { region: loc.stateName } },
          {
            $group: {
              _id: null,
              girlsSupported: { $sum: "$girlsSupported" },
              schools: { $sum: 1 },
            },
          },
        ]);

        // Volunteer teams: volunteers assigned to outreach events whose
        // relatedSchool sits in this state
        const schoolIdsInState = await School.find({ region: loc.stateName }).distinct("_id");
        const outreachInState = await Outreach.find({
          relatedSchool: { $in: schoolIdsInState },
        }).distinct("volunteersAssigned");

        // volunteersAssigned is an array field, so .distinct() above returns
        // arrays-of-arrays in some Mongo versions — flatten and dedupe.
        const volunteerIds = [...new Set(outreachInState.flat().map(String))];

        res.locals = res.locals || {};

        return {
          _id: loc._id,
          stateName: loc.stateName,
          latitude: loc.latitude,
          longitude: loc.longitude,
          girlsSupported: schoolStats[0]?.girlsSupported ?? 0,
          schools: schoolStats[0]?.schools ?? 0,
          volunteerTeams: volunteerIds.length,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
}