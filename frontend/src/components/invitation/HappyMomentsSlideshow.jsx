import { useEffect, useMemo, useState } from 'react';

export default function HappyMomentsSlideshow({ gallery = [] }) {
  const slides = gallery.filter((item) => item?.image);
  const [index, setIndex] = useState(0);
  const [folder, setFolder] = useState('all');

  const folders = useMemo(() => {
    const seen = [];
    slides.forEach((item) => {
      const name = (item.folder || '').trim();
      if (name && !seen.includes(name)) seen.push(name);
    });
    return seen;
  }, [slides]);

  const visibleSlides = useMemo(() => {
    if (folder === 'all' || !folders.length) return slides;
    return slides.filter((item) => (item.folder || '').trim() === folder);
  }, [slides, folder, folders]);

  useEffect(() => {
    if (index >= visibleSlides.length) setIndex(0);
  }, [visibleSlides.length, index]);

  useEffect(() => {
    if (visibleSlides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % visibleSlides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [visibleSlides.length]);

  if (!visibleSlides.length) return null;

  const current = visibleSlides[index];

  const switchFolder = (nextFolder) => {
    setFolder(nextFolder);
    setIndex(0);
  };

  return (
    <section className="inv-section-full inv-happy-moments" id="gallery">
      <div className="inv-section">
        <p className="inv-script-title inv-script-title-small">Happy Moments</p>
        <div className="inv-divider" />
        {folders.length > 0 && (
          <div className="inv-slideshow-tabs" role="tablist" aria-label="Photo albums">
            <button
              type="button"
              role="tab"
              aria-selected={folder === 'all'}
              className={folder === 'all' ? 'active' : ''}
              onClick={() => switchFolder('all')}
            >
              All
            </button>
            {folders.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={folder === name}
                className={folder === name ? 'active' : ''}
                onClick={() => switchFolder(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}
        <div className="inv-slideshow">
          <img src={current.image} alt={current.caption || `Happy moment ${index + 1}`} />
          {current.caption && <p>{current.caption}</p>}
          {visibleSlides.length > 1 && (
            <div className="inv-slideshow-dots">
              {visibleSlides.map((slide, slideIndex) => (
                <button
                  key={slide.image}
                  type="button"
                  className={slideIndex === index ? 'active' : ''}
                  onClick={() => setIndex(slideIndex)}
                  aria-label={`Show slide ${slideIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
