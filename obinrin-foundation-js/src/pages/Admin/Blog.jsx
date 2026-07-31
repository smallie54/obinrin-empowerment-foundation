import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  status: "draft",
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Cover image
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null); // local preview OR existing saved URL
  const fileInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/blog")
      .then((res) => setPosts(res.data))
      .catch(() => setError("Couldn't load posts."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetCoverPicker() {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    resetCoverPicker();
    setModalOpen(true);
  }

  function openEdit(post) {
    setEditingId(post._id);
    setForm({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "",
      status: post.status,
    });
    setFormError("");
    setCoverFile(null);
    setCoverPreview(post.coverImage?.url || null); // show existing cover
    setModalOpen(true);
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      let postId = editingId;

      if (editingId) {
        await api.patch(`/blog/${editingId}`, form);
      } else {
        const res = await api.post("/blog", form);
        postId = res.data._id;
      }
      if (coverFile) {
        const imageForm = new FormData();
        imageForm.append("image", coverFile);
    await api.post(`/blog/${postId}/cover`, imageForm);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      resetCoverPicker();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/blog/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that post.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-charcoal">Blog</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-sm text-charcoal/50">No posts yet.</p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
            <div className="relative h-36 bg-lavender/40">
              {post.coverImage?.url ? (
                <img
                  src={post.coverImage.url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                  <ImagePlus size={28} />
                </div>
              )}
              <span
                className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  post.status === "published"
                    ? "bg-success/15 text-success"
                    : "bg-gold/20 text-gold"
                }`}
              >
                {post.status}
              </span>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(post)}
                  className="bg-white/90 text-charcoal/60 hover:text-purple p-1.5 rounded-full"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(post)}
                  className="bg-white/90 text-charcoal/60 hover:text-red-600 p-1.5 rounded-full"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-heading font-bold text-charcoal">{post.title}</h3>
              {post.category && <p className="text-xs text-purple mt-1">{post.category}</p>}
              <p className="text-sm text-charcoal/60 mt-2 line-clamp-3">
                {post.excerpt || post.content}
              </p>
              <p className="text-xs text-charcoal/40 mt-3">
                {post.publishedAt
                  ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                  : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Post" : "New Post"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
              Cover Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-36 rounded-xl border-2 border-dashed border-charcoal/15 bg-lavender/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple/40 transition-colors"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-charcoal/40 text-xs gap-1">
                  <ImagePlus size={22} />
                  Click to choose an image
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
            {coverPreview && (
              <button
                type="button"
                onClick={resetCoverPicker}
                className="text-[11px] text-charcoal/50 hover:text-red-600 mt-1"
              >
                Remove selected image
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Content *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Program Update"
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
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

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Post"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Post"
        message={`Delete "${deleteTarget?.title}"? This can't be undone.`}
      />
    </div>
  );
}