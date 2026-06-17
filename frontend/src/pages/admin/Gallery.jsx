import { useEffect, useRef, useState } from 'react';
import Button from '../../components/common/Button/Button';
import { galleryService } from '../../services/galleryService';
import { getUploadUrl } from '../../utils/mediaUrl';

const CATEGORIES = [
  { value: 'wedding', label: 'Weddings' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'debut', label: 'Debut' },
  { value: 'birthday', label: 'Birthday' },
];

export default function AdminGallery() {
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('wedding');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const loadGallery = () => {
    setLoading(true);
    galleryService.getAll()
      .then((res) => setItems(res.data || []))
      .catch(() => {
        setItems([]);
        setError('Could not load gallery from the database.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (files) => {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);
      formData.append('caption', caption);
      await galleryService.upload(formData);
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadGallery();
    } catch {
      setError('Upload failed. Make sure you are logged in as admin and the API is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    try {
      await galleryService.delete(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      setError('Could not delete this photo.');
    }
  };

  return (
    <>
      <div className="dash-header">
        <h1>Gallery Management</h1>
        <p>Upload and manage event photos stored in the database.</p>
      </div>

      <div className="card-widget" style={{ marginBottom: 20 }}>
        <h3>Upload New Photos</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Category / Album</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Short caption..." />
          </div>
        </div>
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleUpload(e.dataTransfer.files);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="upload-icon">📷</div>
          <div className="upload-text"><strong>Click to upload photos</strong><br />JPG, PNG, WEBP — max 10MB each</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
        {error && <p style={{ color: '#DC3545', fontSize: 13, marginTop: 12 }}>{error}</p>}
        <Button variant="gold" style={{ marginTop: 16 }} disabled={uploading} onClick={() => fileInputRef.current?.click()}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </div>

      <div className="card-widget">
        <h3>Manage Gallery</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Loading gallery...</p>
        ) : items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No photos uploaded yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 12 }}>
            {items.map((item) => (
              <div key={item.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', background: 'var(--beige)', aspectRatio: 1 }}>
                <img
                  src={getUploadUrl(item.image_path)}
                  alt={item.caption || 'Gallery photo'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(220,53,69,0.9)', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}
                >
                  ✕
                </button>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '8px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', color: '#fff', fontSize: 11 }}>
                  <div>{item.caption || 'Untitled'}</div>
                  <div style={{ opacity: 0.85 }}>{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
