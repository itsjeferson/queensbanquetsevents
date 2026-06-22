import {
  getMediaFieldDisplay,
  isDataUrl,
  readFileAsDataUrl,
} from '../../../utils/mediaUpload';

export default function MediaField({
  label,
  value,
  onChange,
  onClear,
  placeholder = 'https://example.com/photo.jpg',
  accept,
  maxSizeMb,
  onError,
  urlHint = 'Paste a direct link to an online image, or upload a file below.',
  urlLabel = 'Image URL',
}) {
  const hasUploadedFile = isDataUrl(value);
  const hasRemoteUrl = typeof value === 'string'
    && (value.startsWith('http://') || value.startsWith('https://'));

  const clearValue = () => {
    if (onClear) {
      onClear();
      return;
    }
    onChange('');
  };

  const handleFile = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file, maxSizeMb);
      onChange(dataUrl);
      onError?.('');
    } catch (err) {
      onError?.(err.message || 'Could not upload file.');
    }
  };

  return (
    <div className="form-group media-field">
      <label>{label}</label>

      {!hasUploadedFile && (
        <>
          <label className="media-field-url-label">{urlLabel}</label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {urlHint && <p className="media-field-hint">{urlHint}</p>}
        </>
      )}

      {hasUploadedFile && (
        <div className="media-field-uploaded">
          <input readOnly value={getMediaFieldDisplay(value)} />
          <button type="button" className="action-btn" onClick={clearValue}>
            Remove
          </button>
        </div>
      )}

      <div className="media-field-upload">
        <span className="media-field-upload-label">
          {hasUploadedFile ? 'Replace with another file' : 'Or upload from device'}
        </span>
        <input type="file" accept={accept} onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {hasUploadedFile && (
        <button type="button" className="media-field-url-toggle" onClick={clearValue}>
          Use image URL instead
        </button>
      )}

      {hasRemoteUrl && (
        <div className="media-field-preview">
          <img src={value} alt="" />
        </div>
      )}
    </div>
  );
}
