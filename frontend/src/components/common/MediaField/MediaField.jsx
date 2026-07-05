import { useRef, useState } from 'react';
import { Spinner } from '../Loader/Loader';
import { isYouTubeUrl, resolveMediaUrl } from '../../../utils/mediaUrl';
import {
  getMediaFieldDisplay,
  isDataUrl,
  uploadInvitationMediaFile,
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
  rejectYouTube = false,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const hasUploadedFile = isDataUrl(value);
  const hasRemoteUrl = typeof value === 'string' && Boolean(value.trim());

  const clearValue = () => {
    setUploadError('');
    setUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onClear) {
      onClear();
      return;
    }
    onChange('');
  };

  const handleUrlChange = (nextValue) => {
    setUploadError('');
    setUploadSuccess('');
    onChange(nextValue);
    if (rejectYouTube && isYouTubeUrl(nextValue)) {
      const message = 'YouTube links cannot play here. Use a direct MP3, MP4, or WebM file link instead.';
      setUploadError(message);
      onError?.(message);
      return;
    }
    onError?.('');
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');
    try {
      const url = await uploadInvitationMediaFile(file, maxSizeMb);
      onChange(url);
      onError?.('');
      setUploadSuccess(`Uploaded ${file.name}`);
    } catch (err) {
      const message = err.message || 'Could not upload file.';
      setUploadError(message);
      onError?.(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const previewUrl = hasRemoteUrl && !isDataUrl(value) && accept?.startsWith('image')
    ? resolveMediaUrl(value)
    : '';

  return (
    <div className="form-group media-field">
      <label>{label}</label>

      {!hasUploadedFile && (
        <>
          <label className="media-field-url-label">{urlLabel}</label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            disabled={uploading}
          />
          {urlHint && <p className="media-field-hint">{urlHint}</p>}
        </>
      )}

      {hasUploadedFile && (
        <div className="media-field-uploaded">
          <input readOnly value={getMediaFieldDisplay(value)} />
          <button type="button" className="action-btn" onClick={clearValue} disabled={uploading}>
            Remove
          </button>
        </div>
      )}

      <div className="media-field-upload">
        <span className="media-field-upload-label">
          {uploading
            ? 'Uploading...'
            : (hasUploadedFile ? 'Replace with another file' : 'Or upload from device')}
        </span>
        {uploading ? (
          <span className="media-field-uploading">
            <Spinner size="sm" />
          </span>
        ) : (
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        )}
      </div>

      {uploadError && (
        <p className="media-field-error" role="alert">{uploadError}</p>
      )}

      {uploadSuccess && !uploadError && (
        <p className="media-field-success">{uploadSuccess}</p>
      )}

      {hasUploadedFile && (
        <button type="button" className="media-field-url-toggle" onClick={clearValue} disabled={uploading}>
          Use image URL instead
        </button>
      )}

      {previewUrl && (
        <div className="media-field-preview">
          <img src={previewUrl} alt="" />
        </div>
      )}
    </div>
  );
}
