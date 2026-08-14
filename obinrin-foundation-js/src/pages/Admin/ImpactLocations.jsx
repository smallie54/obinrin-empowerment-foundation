import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const emptyForm = {
  stateName: "",
  latitude: "",
  longitude: "",
  visible: true,
};

export default function ImpactLocations() {
  const [locations, setLocations] = useState([]);
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
      .get("/impact-locations")
      .then((res) => setLocations(res.data))
      .catch(() => setError("Couldn't load impact locations."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(location) {
    setEditingId(location._id);
    setForm({
      stateName: location.stateName,
      latitude: location.latitude,
      longitude: location.longitude,
      visible: location.visible,
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
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };
    try {
      if (editingId) {
        await api.patch(`/impact-locations/${editingId}`, payload);
      } else {
        await api.post("/impact-locations", payload);
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save location.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleVisibility(location) {
    try {
      await api.patch(`/impact-locations/${location._id}`, {
        visible: !location.visible,
      });
      load();
    } catch {
      setError("Couldn't update visibility.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/impact-locations/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that location.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-charcoal">Impact Map Locations</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Add a pin for each state. Stats shown on the map are calculated
            automatically from your Schools and Outreach records — no need
            to enter numbers here.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> Add Location
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && locations.length === 0 && (
        <p className="text-sm text-charcoal/50">No locations yet — add your first one above.</p>
      )}

      <div className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
        {locations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[560px]">
              <thead>
                <tr className="text-xs text-charcoal/40 border-b border-charcoal/10">
                  <th className="py-3 px-6 font-medium">State</th>
                  <th className="py-3 px-6 font-medium">Coordinates</th>
                  <th className="py-3 px-6 font-medium">Visible</th>
                  <th className="py-3 px-6 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc._id} className="border-b border-charcoal/5 last:border-0">
                    <td className="py-3 px-6 font-semibold text-charcoal">{loc.stateName}</td>
                    <td className="py-3 px-6 text-charcoal/60 text-xs">
                      {loc.latitude}, {loc.longitude}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => toggleVisibility(loc)}
                        className={`flex items-center gap-1 text-xs font-semibold ${
                          loc.visible ? "text-success" : "text-charcoal/40"
                        }`}
                      >
                        {loc.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {loc.visible ? "Shown" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(loc)} className="text-charcoal/40 hover:text-purple">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(loc)}
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
        title={editingId ? "Edit Location" : "Add Location"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/60">State Name *</label>
            <input
              required
              value={form.stateName}
              onChange={(e) => setForm({ ...form, stateName: e.target.value })}
              placeholder="Must exactly match the School 'Region/State' field and the map file's state name"
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Latitude *</label>
              <input
                required
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                placeholder="6.5244"
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Longitude *</label>
              <input
                required
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                placeholder="3.3792"
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="rounded border-charcoal/20 text-purple focus:ring-purple/30"
            />
            Visible on the public homepage map
          </label>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Location"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Location"
        message={`Delete "${deleteTarget?.stateName}"? This can't be undone.`}
      />
    </div>
  );
}