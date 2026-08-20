import Donor from "../models/Donor.js";
import Partnership from "../models/Partnership.js";
import Volunteer from "../models/Volunteer.js";
import School from "../models/School.js";
import BlogPost from "../models/BlogPost.js";

export async function globalSearch(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ donors: [], partnerships: [], volunteers: [], schools: [], posts: [] });
    }

    const regex = new RegExp(q.trim(), "i");
    const LIMIT = 5;

    const [donors, partnerships, volunteers, schools, posts] = await Promise.all([
      Donor.find({ $or: [{ name: regex }, { email: regex }] }).limit(LIMIT),
      Partnership.find({ name: regex }).limit(LIMIT),
      Volunteer.find({ $or: [{ name: regex }, { email: regex }] }).limit(LIMIT),
      School.find({ name: regex }).limit(LIMIT),
      BlogPost.find({ title: regex }).limit(LIMIT),
    ]);

    res.json({
      donors: donors.map((d) => ({ id: d._id, label: d.name || d.email, path: "/admin/donors" })),
      partnerships: partnerships.map((p) => ({ id: p._id, label: p.name, path: "/admin/partnerships" })),
      volunteers: volunteers.map((v) => ({ id: v._id, label: v.name, path: "/admin/volunteers" })),
      schools: schools.map((s) => ({ id: s._id, label: s.name, path: "/admin/schools" })),
      posts: posts.map((p) => ({ id: p._id, label: p.title, path: "/admin/blog" })),
    });
  } catch (err) {
    next(err);
  }
}