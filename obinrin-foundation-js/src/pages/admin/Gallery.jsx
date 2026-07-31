import { useEffect, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import api from "../../admin/api/client";

const categories = ["Education", "Mentorship", "Health & Well-being", "Community", "Events", "Achievements"];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const [uploading, setUploading] = useState(false);
 const [uploadCategory, setUploadCategory] = useState("Community");
  const [uploadError, setUploadError] = useState("");

  const [deleting, setDeleting] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/gallery", { params: filter ? { category: filter } : {} })
      .then((res) => setImages(res.data))
      .catch(() => setError("Couldn't load gallery images."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", uploadCategory);

    try {
      await api.post("/gallery", formData);
      load();
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await api.delete(`/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch {
      setError("Couldn't delete that image.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading font-bold text-2xl text-charcoal">Gallery</h1>

        <div className="flex items-center gap-3">
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full cursor-pointer transition-colors">
            <Upload size={16} /> {uploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            filter === "" ? "bg-purple text-white" : "bg-white border border-charcoal/15 text-charcoal/60"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
              filter === c ? "bg-purple text-white" : "bg-white border border-charcoal/15 text-charcoal/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && images.length === 0 && (
        <p className="text-sm text-charcoal/50">No images yet — upload one above.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="group relative rounded-2xl overflow-hidden bg-white border border-charcoal/10">
            <img src={img.url} alt={img.caption || img.category} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors flex items-center justify-center">
              <button
                onClick={() => handleDelete(img._id)}
                disabled={deleting === img._id}
                className="opacity-0 group-hover:opacity-100 bg-white text-red-600 rounded-full p-2 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-charcoal capitalize">
              {img.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}