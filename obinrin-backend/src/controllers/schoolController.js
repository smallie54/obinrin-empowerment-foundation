import School from "../models/School.js";
import cloudinary from "../config/cloudinary.js";

export async function listSchools(req, res, next) {
  try {
    const { country, status } = req.query;
    const filter = {};
    if (country) filter.country = country;
    if (status) filter.status = status;

    const schools = await School.find(filter).sort({ createdAt: -1 });
    res.json(schools);
  } catch (err) {
    next(err);
  }
}

export async function getSchool(req, res, next) {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  } catch (err) {
    next(err);
  }
}

export async function createSchool(req, res, next) {
  try {
    const school = await School.create({
      ...req.body,
      createdBy: req.admin._id,
    });
    res.status(201).json(school);
  } catch (err) {
    next(err);
  }
}

export async function updateSchool(req, res, next) {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  } catch (err) {
    next(err);
  }
}

export async function deleteSchool(req, res, next) {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    // Clean up any images stored in Cloudinary
    await Promise.all(
      school.images.map((img) =>
        img.publicId ? cloudinary.uploader.destroy(img.publicId) : null
      )
    );

    res.json({ message: "School deleted" });
  } catch (err) {
    next(err);
  }
}

// Expects req.file from multer-cloudinary middleware
export async function uploadSchoolImage(req, res, next) {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    school.images.push({
      url: req.file.path,
      publicId: req.file.filename,
      caption: req.body.caption || "",
    });
    await school.save();

    res.status(201).json(school);
  } catch (err) {
    next(err);
  }
}

// Aggregate empowerment analytics across all schools for the admin dashboard
export async function empowermentAnalytics(req, res, next) {
  try {
    const [totals] = await School.aggregate([
      {
        $group: {
          _id: null,
          totalGirlsSupported: { $sum: "$girlsSupported" },
          totalPadsDistributed: { $sum: "$padsDistributed" },
          totalMaterialsDelivered: { $sum: "$materialsDelivered" },
          totalSchools: { $sum: 1 },
        },
      },
    ]);

    const byCountry = await School.aggregate([
      {
        $group: {
          _id: "$country",
          girlsSupported: { $sum: "$girlsSupported" },
          schools: { $sum: 1 },
        },
      },
      { $sort: { girlsSupported: -1 } },
    ]);

    const byStatus = await School.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      totals: totals || {
        totalGirlsSupported: 0,
        totalPadsDistributed: 0,
        totalMaterialsDelivered: 0,
        totalSchools: 0,
      },
      byCountry,
      byStatus,
    });
  } catch (err) {
    next(err);
  }
}

export async function publicImpactStats(req, res, next) {
  try {
    const [totals] = await School.aggregate([
      {
        $group: {
          _id: null,
          girlsSupported: { $sum: "$girlsSupported" },
          padsDistributed: { $sum: "$padsDistributed" },
          materialsDelivered: { $sum: "$materialsDelivered" },
          schoolsReached: { $sum: 1 },
        },
      },
    ]);

    res.json(
      totals || {
        girlsSupported: 0,
        padsDistributed: 0,
        materialsDelivered: 0,
        schoolsReached: 0,
      }
    );
  } catch (err) {
    next(err);
  }
}
