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
      <div className="confirm-dialog animate-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className={`confirm-dialog-icon-badge ${tone === 'danger' ? 'badge-danger' : 'badge-gold'}`}>
          {tone === 'danger' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>
        <h3 id="confirm-dialog-title" className="confirm-dialog-title">{title}</h3>
        {message && <p className="confirm-dialog-message">{message}</p>}
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className={`btn ${tone === 'danger' ? 'btn-danger-confirm' : 'btn-gold'}`}
            onClick={onConfirm}
            disabled={loading}
            autoFocus
          >
            {loading ? (
              <>
                <Spinner size="sm" tone="light" />
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
