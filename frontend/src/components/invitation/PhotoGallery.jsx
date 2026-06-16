export default function PhotoGallery({ gallery }) {
  if (!gallery?.length) return null;

  return (
    <section className="inv-section-full" id="gallery">
      <div className="inv-section">
        <p className="inv-script-title">Happy Moments</p>
        <h2>Photo Gallery</h2>
        <div className="inv-divider" />
        <div className="inv-gallery-grid">
          {gallery.map((item, index) => (
            <figure key={index} className="inv-gallery-item">
              {item.image ? (
                <img src={item.image} alt={item.caption || `Gallery ${index + 1}`} />
              ) : (
                <div className="inv-gallery-placeholder">{item.caption || 'Photo'}</div>
              )}
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
