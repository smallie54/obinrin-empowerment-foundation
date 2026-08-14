import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UserPlus, Link2 } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const statusStyle = {
  available: "bg-success/15 text-success",
  assigned: "bg-purple/10 text-purple",
  inactive: "bg-charcoal/10 text-charcoal/50",
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  availability: "",
  skills: "",
  status: "available",
  notes: "",
};

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [assignTarget, setAssignTarget] = useState(null);
  const [outreachOptions, setOutreachOptions] = useState([]);
  const [selectedOutreach, setSelectedOutreach] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

  function load() {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    api
      .get("/volunteers", { params })
      .then((res) => setVolunteers(res.data))
      .catch(() => setError("Couldn't load volunteers."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

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
      skills: (v.skills || []).join(", "),
      status: v.status,
      notes: v.notes || "",
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    const payload = {
      ...form,
      skills: form.skills
        ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editingId) {
        await api.patch(`/volunteers/${editingId}`, payload);
      } else {
        await api.post("/volunteers/apply", payload);
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

  async function openAssign(v) {
    setAssignTarget(v);
    setSelectedOutreach("");
    setAssignError("");
    try {
      const res = await api.get("/outreach", {
        params: { status: "planning" },
      });
      setOutreachOptions(res.data);
    } catch {
      setAssignError("Couldn't load outreach events.");
    }
  }

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedOutreach) return;
    setAssigning(true);
    setAssignError("");
    try {
      await api.post(`/volunteers/${assignTarget._id}/assign`, {
        outreachId: selectedOutreach,
      });
      setAssignTarget(null);
      load();
    } catch (err) {
      setAssignError(err.response?.data?.message || "Couldn't assign volunteer.");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-charcoal">Volunteers</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> Add Volunteer
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
        {loading && <p className="p-6 text-sm text-charcoal/50">Loading...</p>}
        {error && <p className="p-6 text-sm text-red-600">{error}</p>}
        {!loading && !error && volunteers.length === 0 && (
          <p className="p-6 text-sm text-charcoal/50">No volunteers yet.</p>
        )}

        {!loading && volunteers.length > 0 && (
          <div className="divide-y divide-charcoal/5">
            {volunteers.map((v) => (
              <div key={v._id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center shrink-0 text-purple">
                  <UserPlus size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-charcoal">{v.name}</p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${statusStyle[v.status]}`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/50 mt-0.5">
                    {v.email}
                    {v.phone && ` · ${v.phone}`}
                    {v.availability && ` · ${v.availability}`}
                  </p>
                  {v.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {v.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-lavender text-purple"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {v.assignedOutreach?.length > 0 && (
                    <p className="text-xs text-charcoal/40 mt-2">
                      Assigned to: {v.assignedOutreach.map((o) => o.title).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openAssign(v)}
                    title="Assign to outreach"
                    className="text-charcoal/40 hover:text-purple p-1"
                  >
                    <Link2 size={15} />
                  </button>
                  <button
                    onClick={() => openEdit(v)}
                    className="text-charcoal/40 hover:text-purple p-1"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(v)}
                    className="text-charcoal/40 hover:text-red-600 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

          <div>
            <label className="text-xs font-semibold text-charcoal/60">
              Skills (comma-separated)
            </label>
            <input
              placeholder="e.g. First Aid, Public Speaking"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
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
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Volunteer"}
          </button>
        </form>
      </Modal>

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={`Assign ${assignTarget?.name || ""} to Outreach`}
      >
        <form onSubmit={handleAssign} className="space-y-4">
          {outreachOptions.length === 0 ? (
            <p className="text-sm text-charcoal/50">
              No outreach events in planning right now — create one first from Outreach
              Planning.
            </p>
          ) : (
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Outreach Event</label>
              <select
                required
                value={selectedOutreach}
                onChange={(e) => setSelectedOutreach(e.target.value)}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              >
                <option value="">Select an event...</option>
                {outreachOptions.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {assignError && <p className="text-xs text-red-600">{assignError}</p>}

          {outreachOptions.length > 0 && (
            <button
              type="submit"
              disabled={assigning || !selectedOutreach}
              className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {assigning ? "Assigning..." : "Assign"}
            </button>
          )}
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