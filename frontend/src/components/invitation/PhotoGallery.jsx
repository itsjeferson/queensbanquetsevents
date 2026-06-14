const ICONS = { engagement: '💍', prenup: '📸', memories: '✨', default: '🖼️' };

export default function PhotoGallery({ gallery }) {
  if (!gallery?.length) return null;

  return (
    <section className="inv-section-full" id="gallery">
      <div className="inv-section">
        <p className="inv-section-tag">Memories</p>
        <h2>Photo Gallery</h2>
        <div className="inv-divider" />
        <div className="inv-gallery-grid">
          {gallery.map((item, i) => (
            <div key={i} className="inv-gallery-item">
              {item.image ? (
                <img src={item.image} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{ICONS[item.type] || ICONS.default}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
