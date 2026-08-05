import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import api from "../../admin/api/client";
import Modal from "../../admin/components/Modal";
import ConfirmDialog from "../../admin/components/ConfirmDialogue";

const emptyForm = {
  title: "",
  description: "",
  eventDate: "",
  endDate: "",
  venue: "",
  city: "",
  country: "",
  status: "upcoming",
};

export default function Events() {
  const [events, setEvents] = useState([]);
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
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Couldn't load events."))
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

  function openEdit(ev) {
    setEditingId(ev._id);
    setForm({
      title: ev.title,
      description: ev.description || "",
      eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString().slice(0, 10) : "",
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 10) : "",
      venue: ev.location?.venue || "",
      city: ev.location?.city || "",
      country: ev.location?.country || "",
      status: ev.status,
    });
    setFormError("");
    setCoverFile(null);
    setCoverPreview(ev.coverImage?.url || null);
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
    const payload = {
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      endDate: form.endDate || undefined,
      status: form.status,
      location: { venue: form.venue, city: form.city, country: form.country },
    };
    try {
      let eventId = editingId;
      if (editingId) {
        await api.patch(`/events/${editingId}`, payload);
      } else {
        const res = await api.post("/events", payload);
        eventId = res.data._id;
      }

      if (coverFile) {
        const imageForm = new FormData();
        imageForm.append("image", coverFile);
        await api.post(`/events/${eventId}/cover`, imageForm);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      resetCoverPicker();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Couldn't save event.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/events/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setError("Couldn't delete that event.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-charcoal">Events</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-purple hover:bg-purple/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {loading && <p className="text-sm text-charcoal/50">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="text-sm text-charcoal/50">No events yet.</p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {events.map((ev) => (
          <div key={ev._id} className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden">
            <div className="relative h-36 bg-lavender/40">
              {ev.coverImage?.url ? (
                <img src={ev.coverImage.url} alt={ev.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                  <ImagePlus size={28} />
                </div>
              )}
              <span
                className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  ev.status === "upcoming"
                    ? "bg-purple/10 text-purple"
                    : ev.status === "past"
                    ? "bg-charcoal/10 text-charcoal/50"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {ev.status}
              </span>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(ev)}
                  className="bg-white/90 text-charcoal/60 hover:text-purple p-1.5 rounded-full"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(ev)}
                  className="bg-white/90 text-charcoal/60 hover:text-red-600 p-1.5 rounded-full"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-heading font-bold text-charcoal">{ev.title}</h3>
              <p className="text-xs text-charcoal/50 mt-1">
                {ev.eventDate && new Date(ev.eventDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {ev.location?.city && ` · ${ev.location.city}`}
              </p>
              <p className="text-sm text-charcoal/60 mt-2 line-clamp-2">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Event" : "New Event"}
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
            <label className="text-xs font-semibold text-charcoal/60">Description *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Event Date *</label>
              <input
                type="date"
                required
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Venue</label>
              <input
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Country</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/60">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full mt-1 border border-charcoal/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Event"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
        title="Delete Event"
        message={`Delete "${deleteTarget?.title}"? This can't be undone.`}
      />
    </div>
  );
}