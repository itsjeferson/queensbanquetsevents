import { useRef, useState } from 'react';
import { Spinner } from '../Loader/Loader';
import { isHostedMediaUrl, isYouTubeUrl, resolveMediaUrl } from '../../../utils/mediaUrl';
import {
  getMediaFieldDisplay,
  importRemoteMediaUrl,
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
  importToStorage = true,
  previewVariant = 'banner',
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const hasUploadedFile = isDataUrl(value);
  const hasRemoteUrl = typeof value === 'string' && Boolean(value.trim());
  const isImageField = accept?.startsWith('image');

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

  const handleUrlBlur = async () => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!importToStorage || !trimmed || isDataUrl(trimmed) || isHostedMediaUrl(trimmed)) return;

    setUploading(true);
    setUploadError('');
    try {
      const storedUrl = await importRemoteMediaUrl(trimmed);
      if (storedUrl && storedUrl !== trimmed) {
        onChange(storedUrl);
        setUploadSuccess('Saved to cloud storage');
        onError?.('');
      }
    } catch (err) {
      setUploadError(err.message || 'Could not save this URL to cloud storage.');
    } finally {
      setUploading(false);
    }
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

  const previewUrl = hasRemoteUrl && !isDataUrl(value) && isImageField
    ? resolveMediaUrl(value)
    : '';

  return (
    <div className={`form-group media-field${previewVariant ? ` media-field-${previewVariant}` : ''}`}>
      <label>{label}</label>

      {!hasUploadedFile && (
        <>
          <label className="media-field-url-label">{urlLabel}</label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={handleUrlBlur}
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
