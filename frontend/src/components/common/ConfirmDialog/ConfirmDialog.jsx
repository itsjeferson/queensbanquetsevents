import { useEffect } from 'react';
import { Spinner } from '../Loader/Loader';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loadingLabel,
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && !loading) onCancel?.(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel?.(); }}
    >
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <h3 id="confirm-dialog-title" className="confirm-dialog-title">{title}</h3>
        {message && <p className="confirm-dialog-message">{message}</p>}
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className={`btn ${tone === 'danger' ? 'btn-dark confirm-btn-danger' : 'btn-gold'}`}
            onClick={onConfirm}
            disabled={loading}
            autoFocus
          >
            {loading ? (
              <>
                <Spinner size="sm" tone={tone === 'danger' ? 'light' : 'dark'} />
                <span>{loadingLabel || 'Please wait...'}</span>
              </>
            ) : confirmLabel}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
