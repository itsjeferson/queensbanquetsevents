import { testimonials } from '../../../data/testimonials';

export default function Testimonials() {
  return (
    <div className="testimonials-wrap">
      <div className="testimonials-inner">
        <div className="section-tag">Client Love</div>
        <h2 className="section-title" style={{ marginBottom: 8 }}>Words from Our Clients</h2>
        <span className="gold-line" style={{ marginBottom: 48 }} />
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-event">{t.event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
