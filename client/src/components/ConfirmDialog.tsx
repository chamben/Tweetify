interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
}: ConfirmDialogProps): JSX.Element | null {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel} data-testid="confirm-dialog-overlay">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="secondary" onClick={onCancel} data-testid="confirm-dialog-no">
            {cancelLabel}
          </button>
          <button className="danger" onClick={onConfirm} data-testid="confirm-dialog-yes">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
