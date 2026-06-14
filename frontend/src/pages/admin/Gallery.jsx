import Button from '../../components/common/Button/Button';

const galleryEmojis = ['🌹', '💍', '🎊'];

export default function AdminGallery() {
  return (
    <>
      <div className="dash-header">
        <h1>Gallery Management</h1>
        <p>Upload and manage event photos.</p>
      </div>
      <div className="card-widget" style={{ marginBottom: 20 }}>
        <h3>Upload New Photos</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Category / Album</label>
            <select><option>Weddings</option><option>Corporate</option><option>Debut</option><option>Birthday</option></select>
          </div>
          <div className="form-group"><label>Caption</label><input placeholder="Short caption..." /></div>
        </div>
        <div className="upload-zone">
          <div className="upload-icon">📷</div>
          <div className="upload-text"><strong>Click to upload photos</strong><br />JPG, PNG, WEBP — max 20MB each</div>
        </div>
        <Button variant="gold" style={{ marginTop: 16 }}>Upload Photos</Button>
      </div>
      <div className="card-widget">
        <h3>Manage Gallery</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {galleryEmojis.map((emoji) => (
            <div key={emoji} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', background: 'var(--beige)', aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              {emoji}
              <button type="button" style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(220,53,69,0.9)', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <div style={{ borderRadius: 8, border: '2px dashed var(--border-soft)', aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, cursor: 'pointer', color: 'var(--text-muted)' }}>+</div>
        </div>
      </div>
    </>
  );
}
