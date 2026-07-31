import { useEffect, useState } from "react";
import { Plus, ArrowRight, Pencil, Trash2 } from "lucide-react";
import api from "../api/client";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialogue";

const priorityColor = {
  low: "bg-success/15 text-success",
  medium: "bg-gold/20 text-gold",
  high: "bg-red-100 text-red-600",
};

const columnMeta = [
  { key: "idea", title: "Ideas" },
  { key: "planning", title: "Planning" },
  { key: "scheduled", title: "Scheduled" },
  { key: "in-progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
];

const nextStatus = {
  idea: "planning",
  planning: "scheduled",
  scheduled: "in-progress",
  "in-progress": "completed",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
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

function subline(item) {
  const parts = [];
  if (item.eventDate) parts.push(formatDate(item.eventDate));
  if (item.volunteersAssigned?.length) {
    parts.push(`Volunteers: ${item.volunteersAssigned.length}`);
  }
  if (item.status === "completed" && item.girlsReached) {
    parts.push(`Reached: ${item.girlsReached} girls`);
  } else if (item.budget) {
    parts.push(`Budget: ${item.currency || "NGN"} ${(item.budget / 100).toLocaleString()}`);
  }
  return parts.join(" · ") || item.description || "";
}

const emptyForm = {
  title: "",
  description: "",
  priority: "low",
  eventDate: "",
  budget: "",
  currency: "NGN",
  volunteersNeeded: "",
};

export default function OutreachPlanner() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    api
      .get("/outreach/board")
      .then((res) => setBoard(res.data))
      .catch(() => setError("Couldn't load outreach planner."));
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description || "",
      priority: item.priority,
      eventDate: toDateInput(item.eventDate),
      budget: item.budget ? item.budget / 100 : "",
      currency: item.currency || "NGN",
      volunteersNeeded: item.volunteersNeeded || "",
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
      budget: form.budget ? Math.round(Number(form.budget) * 100) : 0,
      volunteersNeeded: form.volunteersNeeded ? Number(form.volunteersNeeded) : 0,
    };
    try {
      if (editingId) {
        await api.patch(`/outreach/${editingId}`, payload);
      } else {
        await api.post("/outreach", payload);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save outreach.");
    } finally {
      setSubmitting(false);
    }
  }

  async function advanceStatus(item) {
    const to = nextStatus[item.status];
    if (!to) return;
    try {
      await api.patch(`/outreach/${item._id}/status`, { status: to });
      load();
    } catch {
      setError("Couldn't move that item — try again.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/outreach/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that item.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-charcoal/10 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading font-bold text-charcoal">Outreach Planner</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
        >
          <Plus size={14} /> New Outreach
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {!board && !error && <p className="text-xs text-charcoal/50">Loading...</p>}

      {board && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
          {columnMeta.map((col) => {
            const items = board[col.key] || [];
            return (
              <div key={col.key} className="min-w-[180px]">
                <p className="text-xs font-semibold text-charcoal/60 mb-3">
                  {col.title} ({items.length})
                </p>
                <div className="space-y-3">
                  {items.length === 0 && (
                    <p className="text-[11px] text-charcoal/30">Nothing here yet</p>
                  )}
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className={`group rounded-xl p-3 border ${
                        item.status === "completed"
                          ? "bg-success/5 border-success/20"
                          : "bg-lavender/40 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-charcoal">{item.title}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEdit(item)} className="text-charcoal/40 hover:text-purple">
                            <Pencil size={11} />
                          </button>
                          <button onClick={() => setDeleteTarget(item)} className="text-charcoal/40 hover:text-red-600">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-charcoal/50 mt-1 leading-snug">
                        {subline(item)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {item.priority && item.status !== "completed" && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${priorityColor[item.priority]}`}
                          >
                            {item.priority}
                          </span>
                        )}
                        {item.status === "completed" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
                            Done
                          </span>
                        )}
                        {nextStatus[item.status] && (
                          <button
                            onClick={() => advanceStatus(item)}
                            title={`Move to ${nextStatus[item.status]}`}
                            className="text-purple hover:text-purple/70 p-1"
                          >
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <a href="/admin/outreach" className="text-xs font-semibold text-purple mt-4 block">
        View All →
      </a>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Outreach" : "New Outreach"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Event Date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Budget (₦)</label>
              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Volunteers Needed</label>
              <input
                type="number"
                min="0"
                value={form.volunteersNeeded}
                onChange={(e) => setForm({ ...form, volunteersNeeded: e.target.value })}
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
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Outreach"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Outreach"
        message={`Delete "${deleteTarget?.title}"? This can't be undone.`}
      />
    </div>
  );
}