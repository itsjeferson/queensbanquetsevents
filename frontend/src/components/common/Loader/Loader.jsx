export function Spinner({ size = 'md', tone = 'gold', className = '' }) {
  const sizeClass = size === 'sm' ? 'app-loader-spinner--sm' : size === 'lg' ? 'app-loader-spinner--lg' : '';
  const toneClass = tone === 'light'
    ? 'app-loader-spinner--light'
    : tone === 'dark'
      ? 'app-loader-spinner--dark'
      : '';

  return (
    <span
      className={['app-loader-spinner', sizeClass, toneClass, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className="app-loader-ring" />
      <span className="app-loader-ring app-loader-ring--delay" />
    </span>
  );
}

export default function Loader({
  text = 'Loading...',
  label,
  variant = 'page',
  showText = true,
}) {
  const message = label ?? text;
  const spinnerSize = variant === 'inline' ? 'sm' : variant === 'invitation' ? 'lg' : 'md';

  return (
    <div
      className={`app-loader app-loader--${variant}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message || 'Loading'}
    >
      <Spinner size={spinnerSize} />
      {showText && message ? <p className="app-loader-text">{message}</p> : null}
    </div>
  );
}
