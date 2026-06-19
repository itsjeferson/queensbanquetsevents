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
  placeholder,
  accept,
  maxSizeMb,
  onError,
}) {
  const hasUploadedFile = isDataUrl(value);

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
    <div className="form-group">
      <label>{label}</label>
      {hasUploadedFile ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input readOnly value={getMediaFieldDisplay(value)} />
          <button type="button" className="action-btn" onClick={() => (onClear ? onClear() : onChange(''))}>
            Remove
          </button>
        </div>
      ) : (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      <input type="file" accept={accept} onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}
