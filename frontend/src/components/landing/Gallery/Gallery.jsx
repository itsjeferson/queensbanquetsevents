import { useState } from 'react';
import { galleryItems, galleryFilters } from '../../../data/gallery';

export default function Gallery({ showHeader = true }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="section">
      {showHeader && (
        <>
          <div className="section-tag">Portfolio</div>
          <h2 className="section-title">Our Gallery</h2>
          <span className="gold-line" />
          <p className="section-sub">A visual journey through our most cherished events and moments.</p>
        </>
      )}
      <div className="gallery-filter">
        {galleryFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-btn${activeFilter === f.id ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {filtered.map((item) => (
          <div key={item.id} className="gallery-item">
            <div className="gallery-placeholder" style={{ height: item.height }}>{item.emoji}</div>
            <div className="gallery-item-overlay">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
