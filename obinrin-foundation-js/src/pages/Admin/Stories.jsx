import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus, Star } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const categories = [
  "Education",
  "Mentorship",
  "Health & Wellness",
  "Leadership",
  "Community",
  "Skill Development",
];

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  girlName: "",
  girlAge: "",
  location: "",
  featured: false,
  status: "draft",
};

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverInputRef = useRef(null);


  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/stories")
      .then((res) => setStories(res.data))
      .catch(() => setError("Couldn't load stories."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetImagePickers() {
    setCoverFile(null);
    setCoverPreview(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    resetImagePickers();
    setModalOpen(true);
  }

  function openEdit(story) {
    setEditingId(story._id);
    setForm({
      title: story.title,
      excerpt: story.excerpt || "",
      content: story.content || "",
      category: story.category || "",
      girlName: story.girlName || "",
      girlAge: story.girlAge || "",
      location: story.location || "",
      featured: story.featured || false,
      status: story.status,
    });
    setFormError("");
    setCoverFile(null);
    setCoverPreview(story.coverImage?.url || null);
    setAvatarFile(null);
    setAvatarPreview(story.avatarImage?.url || null);
    setModalOpen(true);
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      let storyId = editingId;
      const payload = { ...form, girlAge: form.girlAge ? Number(form.girlAge) : undefined };

      if (editingId) {
        await api.patch(`/stories/${editingId}`, payload);
      } else {
        const res = await api.post("/stories", payload);
        storyId = res.data._id;
      }

      // Only hits the network if a new file was actually picked —
      // editing without touching an image leaves it untouched.
      if (coverFile) {
        const coverForm = new FormData();
        coverForm.append("image", coverFile);
        await api.post(`/stories/${storyId}/cover`, coverForm);
      }
      if (avatarFile) {
        const avatarForm = new FormData();
        avatarForm.append("image", avatarFile);
        await api.post(`/stories/${storyId}/avatar`, avatarForm);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      resetImagePickers();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save story.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/stories/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that story.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-charcoal">Stories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> New Story
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && stories.length === 0 && (
        <p className="text-sm text-charcoal/50">No stories yet.</p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {stories.map((story) => (
          <div key={story._id} className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
            <div className="relative h-36 bg-lavender/40">
              {story.coverImage?.url ? (
                <img
                  src={story.coverImage.url}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                  <ImagePlus size={28} />
                </div>
              )}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    story.status === "published"
                      ? "bg-success/15 text-success"
                      : "bg-gold/20 text-gold"
                  }`}
                >
                  {story.status}
                </span>
                {story.featured && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold text-charcoal">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(story)}
                  className="bg-white/90 text-charcoal/60 hover:text-purple p-1.5 rounded-full"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(story)}
                  className="bg-white/90 text-charcoal/60 hover:text-red-600 p-1.5 rounded-full"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2">
                {story.avatarImage?.url && (
                  <img
                    src={story.avatarImage.url}
                    alt={story.girlName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-heading font-bold text-charcoal text-sm">{story.title}</h3>
                  {story.girlName && (
                    <p className="text-xs text-charcoal/50">
                      {story.girlName}
                      {story.girlAge ? `, ${story.girlAge}` : ""} · {story.location}
                    </p>
                  )}
                </div>
              </div>
              {story.category && <p className="text-xs text-purple mt-2">{story.category}</p>}
              <p className="text-sm text-charcoal/60 mt-2 line-clamp-2">{story.excerpt}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Story" : "New Story"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
                Cover Image
              </label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className="relative h-28 rounded-xl border-2 border-dashed border-charcoal/15 bg-lavender/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple/40 transition-colors"
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-charcoal/40 text-[11px] gap-1">
                    <ImagePlus size={18} />
                    Cover photo
                  </div>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
                Girl's Photo (Avatar)
              </label>
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="relative h-28 rounded-xl border-2 border-dashed border-charcoal/15 bg-lavender/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple/40 transition-colors"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-charcoal/40 text-[11px] gap-1">
                    <ImagePlus size={18} />
                    Portrait photo
                  </div>
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. From Struggle to Success: Kemi's Journey"
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="Short summary shown on story cards"
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Full Story</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
              placeholder="Full story text (for a future story detail page)"
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Girl's Name</label>
              <input
                value={form.girlName}
                onChange={(e) => setForm({ ...form, girlName: e.target.value })}
                placeholder="Kemi"
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Age</label>
              <input
                type="number"
                value={form.girlAge}
                onChange={(e) => setForm({ ...form, girlAge: e.target.value })}
                placeholder="16"
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Oyo State, Nigeria"
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-charcoal/20 text-purple focus:ring-purple/30"
            />
            Feature this story (shows in the large highlighted cards)
          </label>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Story"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Story"
        message={`Delete "${deleteTarget?.title}"? This can't be undone.`}
      />
    </div>
  );
}