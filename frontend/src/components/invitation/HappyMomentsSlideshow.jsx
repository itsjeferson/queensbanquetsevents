import { useEffect, useState } from 'react';

export default function HappyMomentsSlideshow({ gallery = [] }) {
  const slides = gallery.filter((item) => item?.image);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const current = slides[index];

  return (
    <section className="inv-section-full inv-happy-moments" id="gallery">
      <div className="inv-section">
        <p className="inv-script-title inv-script-title-small">Happy Moments</p>
        <div className="inv-divider" />
        <div className="inv-slideshow">
          <img src={current.image} alt={current.caption || `Happy moment ${index + 1}`} />
          {current.caption && <p>{current.caption}</p>}
          {slides.length > 1 && (
            <div className="inv-slideshow-dots">
              {slides.map((slide, slideIndex) => (
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
