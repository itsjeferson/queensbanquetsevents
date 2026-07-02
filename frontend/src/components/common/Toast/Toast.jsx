export default function Toast({ show, message, tone = 'success' }) {
  if (!show || !message) return null;

  return (
    <div className={`app-toast app-toast--${tone}`} role="status" aria-live="polite">
      <span className="app-toast-icon" aria-hidden="true">✓</span>
      <span>{message}</span>
    </div>
  );
}
