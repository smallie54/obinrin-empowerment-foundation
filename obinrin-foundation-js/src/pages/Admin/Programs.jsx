import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const emptyForm = {
  name: "",
  description: "",
  highlightStat: "",
  status: "active",
  displayOrder: 0,
};

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/programs")
      .then((res) => setPrograms(res.data))
      .catch(() => setError("Couldn't load programs."))
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

  function openEdit(program) {
    setEditingId(program._id);
    setForm({
      name: program.name,
      description: program.description,
      highlightStat: program.highlightStat || "",
      status: program.status,
      displayOrder: program.displayOrder || 0,
    });
    setFormError("");
    setCoverFile(null);
    setCoverPreview(program.coverImage?.url || null);
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
      let programId = editingId;
      if (editingId) {
        await api.patch(`/programs/${editingId}`, form);
      } else {
        const res = await api.post("/programs", form);
        programId = res.data._id;
      }

      if (coverFile) {
        const imageForm = new FormData();
        imageForm.append("image", coverFile);
        await api.post(`/programs/${programId}/cover`, imageForm);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      resetCoverPicker();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save program.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/programs/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that program.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-charcoal">Programs</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            The program categories shown on the public Programs page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> New Program
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && programs.length === 0 && (
        <p className="text-sm text-charcoal/50">No programs yet.</p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {programs.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
            <div className="relative h-32 bg-lavender/40">
              {p.coverImage?.url ? (
                <img src={p.coverImage.url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                  <ImagePlus size={24} />
                </div>
              )}
              <span
                className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  p.status === "active"
                    ? "bg-success/15 text-success"
                    : p.status === "planned"
                    ? "bg-gold/20 text-gold"
                    : "bg-charcoal/10 text-charcoal/50"
                }`}
              >
                {p.status}
              </span>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(p)}
                  className="bg-white/90 text-charcoal/60 hover:text-purple p-1.5 rounded-full"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="bg-white/90 text-charcoal/60 hover:text-red-600 p-1.5 rounded-full"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-heading font-bold text-charcoal">{p.name}</h3>
              {p.highlightStat && (
                <p className="text-xs font-semibold text-purple mt-1">{p.highlightStat}</p>
              )}
              <p className="text-sm text-charcoal/60 mt-2 line-clamp-3">{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Program" : "New Program"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
              Cover Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-32 rounded-xl border-2 border-dashed border-charcoal/15 bg-lavender/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple/40 transition-colors"
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-charcoal/40 text-xs gap-1">
                  <ImagePlus size={20} />
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
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Program Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Education"
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Description *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Highlight Stat</label>
            <input
              value={form.highlightStat}
              onChange={(e) => setForm({ ...form, highlightStat: e.target.value })}
              placeholder="e.g. 2,500+ girls reached"
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              >
                <option value="active">Active</option>
                <option value="planned">Planned</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Program"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Program"
        message={`Delete "${deleteTarget?.name}"? This can't be undone.`}
      />
    </div>
  );
}