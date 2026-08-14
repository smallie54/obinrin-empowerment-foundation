import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Handshake } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toDateInput(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
}

const emptyForm = {
  name: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  status: "pending",
  fundingProgress: 0,
  lastMeetingAt: "",
  nextFollowUpAt: "",
  notes: "",
};

export default function Partnerships() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    api
      .get("/partnerships", { params })
      .then((res) => setPartners(res.data))
      .catch(() => setError("Couldn't load partnerships."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  function resetLogoPicker() {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    resetLogoPicker();
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      contactName: p.contactName || "",
      contactEmail: p.contactEmail || "",
      contactPhone: p.contactPhone || "",
      status: p.status,
      fundingProgress: p.fundingProgress || 0,
      lastMeetingAt: toDateInput(p.lastMeetingAt),
      nextFollowUpAt: toDateInput(p.nextFollowUpAt),
      notes: p.notes || "",
    });
    setFormError("");
    setLogoFile(null);
    setLogoPreview(p.logo?.url || null);
    setModalOpen(true);
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      let partnerId = editingId;
      if (editingId) {
        await api.patch(`/partnerships/${editingId}`, form);
      } else {
        const res = await api.post("/partnerships", form);
        partnerId = res.data._id;
      }

      if (logoFile) {
        const imageForm = new FormData();
        imageForm.append("image", logoFile);
        await api.post(`/partnerships/${partnerId}/logo`, imageForm);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      resetLogoPicker();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save partnership.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/partnerships/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that partnership.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-charcoal">Partnerships</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> Add Partner
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && partners.length === 0 && (
        <p className="text-sm text-charcoal/50">No partnerships yet.</p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {partners.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-charcoal/10 p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {p.logo?.url ? (
                  <img
                    src={p.logo.url}
                    alt={p.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-pink flex items-center justify-center text-purple shrink-0">
                    <Handshake size={18} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-charcoal truncate">{p.name}</p>
                  {p.contactName && (
                    <p className="text-xs text-charcoal/50 truncate">{p.contactName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => openEdit(p)} className="text-charcoal/40 hover:text-purple p-1">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="text-charcoal/40 hover:text-red-600 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <span
              className={`inline-block mt-3 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                p.status === "active"
                  ? "bg-success/15 text-success"
                  : p.status === "pending"
                  ? "bg-gold/20 text-gold"
                  : "bg-charcoal/10 text-charcoal/50"
              }`}
            >
              {p.status}
            </span>

            <p className="text-xs text-charcoal/50 mt-3">
              Last Meeting: {formatDate(p.lastMeetingAt)} · Next: {formatDate(p.nextFollowUpAt)}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 bg-lavender rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple rounded-full"
                  style={{ width: `${p.fundingProgress || 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-charcoal/60 shrink-0">
                {p.fundingProgress || 0}%
              </span>
            </div>

            {p.notes && (
              <p className="text-xs text-charcoal/50 mt-3 line-clamp-2">{p.notes}</p>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Partner" : "Add Partner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
              Logo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-20 w-20 rounded-full border-2 border-dashed border-charcoal/15 bg-lavender/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple/40 transition-colors"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <Handshake size={22} className="text-charcoal/30" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Organization Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Contact Name</label>
              <input
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Contact Phone</label>
              <input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
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
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Last Meeting</label>
              <input
                type="date"
                value={form.lastMeetingAt}
                onChange={(e) => setForm({ ...form, lastMeetingAt: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Next Follow-up</label>
              <input
                type="date"
                value={form.nextFollowUpAt}
                onChange={(e) => setForm({ ...form, nextFollowUpAt: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">
              Funding Progress ({form.fundingProgress}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={form.fundingProgress}
              onChange={(e) => setForm({ ...form, fundingProgress: Number(e.target.value) })}
              className="w-full mt-2 accent-purple"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Partnership"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Partnership"
        message={`Delete "${deleteTarget?.name}"? This can't be undone.`}
      />
    </div>
  );
}