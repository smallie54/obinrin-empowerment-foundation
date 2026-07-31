import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const programOptions = [
  "educational-materials",
  "sanitary-pads",
  "mentorship",
  "leadership-development",
];

const emptyForm = {
  name: "",
  country: "",
  region: "",
  address: "",
  girlsSupported: "",
  padsDistributed: "",
  materialsDelivered: "",
  programsDelivered: [],
  status: "active",
  notes: "",
};

export default function Schools() {
  const [schools, setSchools] = useState([]);
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
      .get("/schools")
      .then((res) => setSchools(res.data))
      .catch(() => setError("Couldn't load schools."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(school) {
    setEditingId(school._id);
    setForm({
      name: school.name,
      country: school.country,
      region: school.region || "",
      address: school.address || "",
      girlsSupported: school.girlsSupported || "",
      padsDistributed: school.padsDistributed || "",
      materialsDelivered: school.materialsDelivered || "",
      programsDelivered: school.programsDelivered || [],
      status: school.status,
      notes: school.notes || "",
    });
    setFormError("");
    setModalOpen(true);
  }

  function toggleProgram(program) {
    setForm((f) => ({
      ...f,
      programsDelivered: f.programsDelivered.includes(program)
        ? f.programsDelivered.filter((p) => p !== program)
        : [...f.programsDelivered, program],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    const payload = {
      ...form,
      girlsSupported: Number(form.girlsSupported) || 0,
      padsDistributed: Number(form.padsDistributed) || 0,
      materialsDelivered: Number(form.materialsDelivered) || 0,
    };
    try {
      if (editingId) {
        await api.patch(`/schools/${editingId}`, payload);
      } else {
        await api.post("/schools", payload);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save school.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/schools/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that school.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-charcoal">Schools</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Empowerment records — these numbers feed the public homepage impact counters.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> Add School
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && schools.length === 0 && (
        <p className="text-sm text-charcoal/50">No schools yet — add your first one above.</p>
      )}

      <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
        {schools.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[760px]">
              <thead>
                <tr className="text-xs text-charcoal/40 border-b border-charcoal/10">
                  <th className="py-3 px-6 font-medium">School</th>
                  <th className="py-3 px-6 font-medium">Country</th>
                  <th className="py-3 px-6 font-medium">Girls Supported</th>
                  <th className="py-3 px-6 font-medium">Pads</th>
                  <th className="py-3 px-6 font-medium">Materials</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s._id} className="border-b border-charcoal/5 last:border-0">
                    <td className="py-3 px-6">
                      <p className="font-semibold text-charcoal">{s.name}</p>
                      {s.region && <p className="text-xs text-charcoal/50">{s.region}</p>}
                    </td>
                    <td className="py-3 px-6 text-charcoal/70">{s.country}</td>
                    <td className="py-3 px-6 text-charcoal/70">
                      {(s.girlsSupported || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-charcoal/70">
                      {(s.padsDistributed || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-charcoal/70">
                      {(s.materialsDelivered || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          s.status === "active"
                            ? "bg-success/15 text-success"
                            : s.status === "planned"
                            ? "bg-gold/20 text-gold"
                            : "bg-charcoal/10 text-charcoal/50"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="text-charcoal/40 hover:text-purple">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="text-charcoal/40 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit School" : "Add School"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60">School Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Country *</label>
              <input
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Region / State</label>
              <input
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Girls Supported</label>
              <input
                type="number"
                min="0"
                value={form.girlsSupported}
                onChange={(e) => setForm({ ...form, girlsSupported: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Pads Distributed</label>
              <input
                type="number"
                min="0"
                value={form.padsDistributed}
                onChange={(e) => setForm({ ...form, padsDistributed: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Materials Delivered</label>
              <input
                type="number"
                min="0"
                value={form.materialsDelivered}
                onChange={(e) => setForm({ ...form, materialsDelivered: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60 mb-2 block">
              Programs Delivered
            </label>
            <div className="flex flex-wrap gap-2">
              {programOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProgram(p)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    form.programsDelivered.includes(p)
                      ? "bg-purple text-white border-purple"
                      : "bg-white text-charcoal/60 border-charcoal/15"
                  }`}
                >
                  {p.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="planned">Planned</option>
            </select>
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
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Add School"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete School"
        message={`Delete "${deleteTarget?.name}"? This can't be undone.`}
      />
    </div>
  );
}