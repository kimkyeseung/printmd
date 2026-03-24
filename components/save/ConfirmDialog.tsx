'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 z-[61] w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--ui-border)] bg-[var(--background)] p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h3 id="confirm-title" className="text-lg font-semibold">
          {title}
        </h3>
        <p id="confirm-message" className="mt-2 text-sm text-[var(--ui-text-muted)]">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded border border-[var(--ui-border)] px-4 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
