import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-decor" />
      <div className="hero-inner">
        <div>
          <div className="hero-tag">Premium Event Management</div>
          <h1 className="animate-in">Crafting<br /><em>Unforgettable</em><br />Moments</h1>
          <p className="hero-desc animate-in delay-1">
            From intimate gatherings to grand celebrations, we transform your vision into extraordinary experiences that last a lifetime.
          </p>
          <div className="hero-actions animate-in delay-2">
            <Link to="/packages"><Button variant="gold" size="lg">Explore Packages</Button></Link>
            <Link to="/gallery"><Button variant="outline" size="lg">View Gallery</Button></Link>
          </div>
          <div className="hero-stats animate-in delay-3">
            <div className="hero-stat"><strong>500+</strong><span>Events Done</span></div>
            <div className="hero-stat"><strong>98%</strong><span>Satisfaction</span></div>
            <div className="hero-stat"><strong>12+</strong><span>Years Experience</span></div>
          </div>
        </div>
        <div className="hero-visual animate-in delay-4">
          <div className="hero-card-stack">
            <div className="hero-card hero-card-main">
              <div style={{ fontSize: 50, marginBottom: 16 }}>🌹</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Grand Wedding</p>
              <p style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>Sophia & James</p>
              <p style={{ color: 'rgba(212,175,55,0.8)', fontSize: 12, marginTop: 4 }}>✓ Successfully Completed</p>
            </div>
            <div className="hero-card hero-card-float">
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Next Event</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--black)' }}>Garden Wedding</p>
              <p style={{ fontSize: 12, color: 'var(--gold-dark)' }}>Dec 28, 2024</p>
            </div>
            <div className="hero-card hero-card-float2">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>This Month</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', fontFamily: "'Playfair Display', serif" }}>24</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>bookings</p>
            </div>
            <div className="floating-badge">⭐ 5.0 — Top Rated</div>
          </div>
        </div>
      </div>
    </section>
  );
}
