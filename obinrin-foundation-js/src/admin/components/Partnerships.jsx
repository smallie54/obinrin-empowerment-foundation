import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../api/client";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialogue";

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
  status: "pending",
  fundingProgress: 0,
  nextFollowUpAt: "",
};

export default function Partnerships() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    api
      .get("/partnerships")
      .then((res) => setPartners(res.data))
      .catch(() => setError("Couldn't load partnerships."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      contactName: p.contactName || "",
      contactEmail: p.contactEmail || "",
      status: p.status,
      fundingProgress: p.fundingProgress || 0,
      nextFollowUpAt: toDateInput(p.nextFollowUpAt),
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/partnerships/${editingId}`, form);
      } else {
        await api.post("/partnerships", form);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
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
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading font-bold text-charcoal">Partnerships</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 border border-charcoal/15 text-charcoal/70 text-xs font-semibold px-3 py-2 rounded-full hover:border-purple/40 transition-colors"
        >
          <Plus size={14} /> Add Partner
        </button>
      </div>

      {loading && <p className="text-xs text-charcoal/50">Loading...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!loading && !error && partners.length === 0 && (
        <p className="text-xs text-charcoal/50">No partnerships yet.</p>
      )}

      <div className="space-y-5">
        {partners.slice(0, 5).map((p) => (
          <div key={p._id} className="flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-full bg-pink flex items-center justify-center shrink-0 text-purple font-heading font-bold text-sm">
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-charcoal truncate">{p.name}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      p.status === "active"
                        ? "bg-success/15 text-success"
                        : p.status === "pending"
                        ? "bg-gold/20 text-gold"
                        : "bg-charcoal/10 text-charcoal/50"
                    }`}
                  >
                    {p.status}
                  </span>
                  <button
                    onClick={() => openEdit(p)}
                    className="opacity-0 group-hover:opacity-100 text-charcoal/40 hover:text-purple transition-opacity"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="opacity-0 group-hover:opacity-100 text-charcoal/40 hover:text-red-600 transition-opacity"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {p.contactName && (
                <p className="text-xs text-charcoal/50 mt-0.5">Contact: {p.contactName}</p>
              )}
              <p className="text-xs text-charcoal/50">
                Last Meeting: {formatDate(p.lastMeetingAt)} · Next: {formatDate(p.nextFollowUpAt)}
              </p>
              <div className="flex items-center gap-2 mt-2">
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
            </div>
          </div>
        ))}
      </div>

      {partners.length > 5 && (
        <a href="/admin/partnerships" className="text-xs font-semibold text-purple mt-5 block">
          View All Partnerships →
        </a>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Partner" : "Add Partner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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