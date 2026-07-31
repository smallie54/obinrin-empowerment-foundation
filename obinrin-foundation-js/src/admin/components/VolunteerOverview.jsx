import { useEffect, useState } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import api from "../api/client";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialogue";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const emptyForm = { name: "", email: "", phone: "", availability: "", status: "available" };

export default function VolunteerOverview() {
  const [volunteers, setVolunteers] = useState([]);
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState("");

  const [listOpen, setListOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    api
      .get("/volunteers")
      .then((res) => {
        const list = res.data;
        setVolunteers(list);

        const now = Date.now();
        const available = list.filter((v) => v.status === "available").length;
        const assigned = list.filter((v) => v.status === "assigned").length;
        const activeThisMonth = list.filter(
          (v) => now - new Date(v.updatedAt).getTime() < THIRTY_DAYS_MS
        ).length;

        setCounts({ available, assigned, activeThisMonth, total: list.length });
      })
      .catch(() => setError("Couldn't load volunteers."));
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(v) {
    setEditingId(v._id);
    setForm({
      name: v.name,
      email: v.email,
      phone: v.phone || "",
      availability: v.availability || "",
      status: v.status,
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
        await api.patch(`/volunteers/${editingId}`, form);
      } else {
        await api.post("/volunteers/apply", form);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save volunteer.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/volunteers/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that volunteer.");
    } finally {
      setDeleting(false);
    }
  }

  const rows = counts
    ? [
        { label: "Available Volunteers", value: counts.available },
        { label: "Assigned to Outreach", value: counts.assigned },
        { label: "Active This Month", value: counts.activeThisMonth },
        { label: "Total Volunteers", value: counts.total },
      ]
    : [];

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-charcoal">Volunteer Overview</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => setListOpen(true)} className="text-xs font-semibold text-purple">
            Manage
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1 text-xs font-semibold text-purple"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {!counts && !error && <p className="text-xs text-charcoal/50">Loading...</p>}

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-charcoal/70">{r.label}</span>
            <span className="flex items-center gap-2 font-heading font-bold text-charcoal">
              {r.value}
              <Users size={14} className="text-charcoal/30" />
            </span>
          </div>
        ))}
      </div>

      <Modal open={listOpen} onClose={() => setListOpen(false)} title="Manage Volunteers">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {volunteers.length === 0 && (
            <p className="text-xs text-charcoal/50">No volunteers yet.</p>
          )}
          {volunteers.map((v) => (
            <div
              key={v._id}
              className="flex items-center justify-between gap-2 border border-charcoal/10 rounded-lg px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal truncate">{v.name}</p>
                <p className="text-xs text-charcoal/50 truncate">
                  {v.email} · <span className="capitalize">{v.status}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(v)} className="text-charcoal/40 hover:text-purple p-1">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(v)}
                  className="text-charcoal/40 hover:text-red-600 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Volunteer" : "Add Volunteer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/60">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Availability</label>
              <input
                placeholder="e.g. Weekends"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          {editingId && (
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Volunteer"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Volunteer"
        message={`Delete "${deleteTarget?.name}"? This can't be undone.`}
      />
    </div>
  );
}