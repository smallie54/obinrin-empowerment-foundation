import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus, Star, Link as LinkIcon, Upload } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const emptyForm = {
  title: "",
  description: "",
  sourceType: "url",
  videoUrl: "",
  featured: false,
  status: "draft",
};

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Video file (only used when sourceType === "upload")
  const [videoFile, setVideoFile] = useState(null);
  const videoInputRef = useRef(null);

  // Thumbnail
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const thumbInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/videos")
      .then((res) => setVideos(res.data))
      .catch(() => setError("Couldn't load videos."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetPickers() {
    setVideoFile(null);
    setThumbFile(null);
    setThumbPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    resetPickers();
    setModalOpen(true);
  }

  function openEdit(video) {
    setEditingId(video._id);
    setForm({
      title: video.title,
      description: video.description || "",
      sourceType: video.sourceType,
      videoUrl: video.videoUrl || "",
      featured: video.featured || false,
      status: video.status,
    });
    setFormError("");
    setVideoFile(null);
    setThumbFile(null);
    setThumbPreview(video.thumbnail?.url || null);
    setModalOpen(true);
  }

  function handleVideoFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
  }

  function handleThumbChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (form.sourceType === "url" && !form.videoUrl) {
      setFormError("Paste a YouTube or Vimeo link, or switch to file upload.");
      return;
    }
    if (form.sourceType === "upload" && !editingId && !videoFile) {
      setFormError("Choose a video file to upload.");
      return;
    }

    setSubmitting(true);
    try {
      let videoId = editingId;
      const payload = {
        title: form.title,
        description: form.description,
        sourceType: form.sourceType,
        videoUrl: form.sourceType === "url" ? form.videoUrl : undefined,
        featured: form.featured,
        status: form.status,
      };

      if (editingId) {
        await api.patch(`/videos/${editingId}`, payload);
      } else {
        const res = await api.post("/videos", payload);
        videoId = res.data._id;
      }

      // Only hits the network if a new file was actually picked
      if (form.sourceType === "upload" && videoFile) {
        const videoForm = new FormData();
        videoForm.append("video", videoFile);
        await api.post(`/videos/${videoId}/video-file`, videoForm);
      }
      if (thumbFile) {
        const thumbForm = new FormData();
        thumbForm.append("image", thumbFile);
        await api.post(`/videos/${videoId}/thumbnail`, thumbForm);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      resetPickers();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save video.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/videos/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that video.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-charcoal">Videos</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            The video marked Featured (and Published) is what shows on the
            homepage's "Watch Their Story" section.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> New Video
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && videos.length === 0 && (
        <p className="text-sm text-charcoal/50">No videos yet.</p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {videos.map((video) => (
          <div key={video._id} className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
            <div className="relative h-36 bg-lavender/40">
              {video.thumbnail?.url ? (
                <img
                  src={video.thumbnail.url}
                  alt={video.title}
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
                    video.status === "published"
                      ? "bg-success/15 text-success"
                      : "bg-gold/20 text-gold"
                  }`}
                >
                  {video.status}
                </span>
                {video.featured && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold text-charcoal">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-charcoal">
                {video.sourceType === "url" ? <LinkIcon size={10} /> : <Upload size={10} />}
                {video.sourceType === "url" ? "Link" : "Uploaded"}
              </span>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(video)}
                  className="bg-white/90 text-charcoal/60 hover:text-purple p-1.5 rounded-full"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(video)}
                  className="bg-white/90 text-charcoal/60 hover:text-red-600 p-1.5 rounded-full"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-heading font-bold text-charcoal">{video.title}</h3>
              {video.description && (
                <p className="text-sm text-charcoal/60 mt-2 line-clamp-2">{video.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Video" : "New Video"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
              Thumbnail
            </label>
            <div
              onClick={() => thumbInputRef.current?.click()}
              className="relative h-32 rounded-xl border-2 border-dashed border-charcoal/15 bg-lavender/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple/40 transition-colors"
            >
              {thumbPreview ? (
                <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-charcoal/40 text-xs gap-1">
                  <ImagePlus size={22} />
                  Click to choose a thumbnail
                </div>
              )}
            </div>
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbChange}
              className="hidden"
            />
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
            <label className="text-xs font-semibold text-charcoal/60">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
              Video Source
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, sourceType: "url" })}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-lg border transition-colors ${
                  form.sourceType === "url"
                    ? "bg-purple text-white border-purple"
                    : "bg-white text-charcoal/60 border-charcoal/15"
                }`}
              >
                <LinkIcon size={13} /> YouTube / Vimeo Link
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, sourceType: "upload" })}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-lg border transition-colors ${
                  form.sourceType === "upload"
                    ? "bg-purple text-white border-purple"
                    : "bg-white text-charcoal/60 border-charcoal/15"
                }`}
              >
                <Upload size={13} /> Upload File
              </button>
            </div>

            {form.sourceType === "url" ? (
              <input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-charcoal/15 rounded-lg py-3 text-xs text-charcoal/50 hover:border-purple/40 transition-colors"
                >
                  <Upload size={16} />
                  {videoFile ? videoFile.name : "Choose a video file (max 100MB)"}
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
                {editingId && !videoFile && (
                  <p className="text-[11px] text-charcoal/40 mt-1">
                    Leave empty to keep the currently uploaded video.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-charcoal/20 text-purple focus:ring-purple/30"
                />
                Featured (shown on homepage)
              </label>
            </div>
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Video"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Video"
        message={`Delete "${deleteTarget?.title}"? This can't be undone.`}
      />
    </div>
  );
}