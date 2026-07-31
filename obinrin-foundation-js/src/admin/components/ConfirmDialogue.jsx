import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirming }) {
  return (
    <Modal open={open} onClose={onClose} title={title || "Are you sure?"}>
      <p className="text-sm text-charcoal/70 mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 border border-charcoal/15 text-charcoal/70 font-semibold text-sm py-2.5 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={confirming}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
        >
          {confirming ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}