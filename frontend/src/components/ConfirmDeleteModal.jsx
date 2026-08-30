import "./ConfirmDeleteModal.css";

function ConfirmDeleteModal({ isOpen, fileName, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3 id="modal-title" className="modal-title">
          Delete Resume?
        </h3>
        <p className="modal-description">
          Are you sure you want to delete <strong>{fileName}</strong>? This action cannot be undone and will remove all associated analyses and job matches.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-delete-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
