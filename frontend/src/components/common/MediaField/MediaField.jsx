import { useState } from 'react';
import { Spinner } from '../Loader/Loader';
import { isYouTubeUrl } from '../../../utils/mediaUrl';
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
  const [uploading, setUploading] = useState(false);
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

  const handleUrlChange = (nextValue) => {
    onChange(nextValue);
    if (rejectYouTube && isYouTubeUrl(nextValue)) {
      onError?.('YouTube links cannot play here. Use a direct MP3, MP4, or WebM file link instead.');
      return;
    }
    onError?.('');
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadInvitationMediaFile(file, maxSizeMb);
      onChange(url);
      onError?.('');
    } catch (err) {
      onError?.(err.message || 'Could not upload file.');
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = hasRemoteUrl ? value : '';

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
          <input type="file" accept={accept} onChange={(e) => handleFile(e.target.files?.[0])} />
        )}
      </div>

      {hasUploadedFile && (
        <button type="button" className="media-field-url-toggle" onClick={clearValue} disabled={uploading}>
          Use image URL instead
        </button>
      )}

      {previewUrl && accept?.startsWith('image') && (
        <div className="media-field-preview">
          <img src={previewUrl} alt="" />
        </div>
      )}
    </div>
  );
}
