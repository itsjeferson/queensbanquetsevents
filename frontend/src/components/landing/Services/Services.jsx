import { Link } from 'react-router-dom';

const previewServices = [
  { icon: '💍', title: 'Wedding Planning', desc: 'From intimate ceremonies to grand receptions — every detail perfected for your once-in-a-lifetime day.' },
  { icon: '🎊', title: 'Corporate Events', desc: 'Conferences, galas, and team experiences crafted to leave lasting impressions on every attendee.' },
  { icon: '🎂', title: 'Debut & Birthday', desc: 'Milestone celebrations made magical — debutante balls, milestone birthdays, and special occasions.' },
  { icon: '🌿', title: 'Garden Parties', desc: 'Lush outdoor celebrations with premium florals, elegant setups, and enchanting atmospheres.' },
  { icon: '🍽️', title: 'Catering & Cuisine', desc: 'Curated menus by world-class chefs — from fine dining to interactive food stations.' },
  { icon: '📸', title: 'Photography & Film', desc: 'Professional photography and cinematic videography to preserve every precious memory.' },
];

const fullServices = [
  ...previewServices,
  { icon: '🎵', title: 'Entertainment', desc: 'Live bands, DJs, acoustic performers, host/emcee services, and audio-visual production teams.' },
  { icon: '🚗', title: 'Transport & Logistics', desc: 'Luxury vehicle hire, guest shuttle services, and full on-site logistics management.' },
  { icon: '💐', title: 'Floral Design', desc: 'Bespoke floral arrangements by our in-house designers — from minimalist to maximalist botanical spectacles.' },
];

export default function Services({ preview = false, showHeader = true }) {
  const services = preview ? previewServices : fullServices;
  const ctaText = preview ? 'Learn more →' : 'Inquire now →';

  return (
    <div className={preview ? 'section' : ''}>
      {showHeader && (
        <>
          <div className="section-tag">{preview ? 'What We Offer' : 'What We Do'}</div>
          <h2 className="section-title">{preview ? 'Our Core Services' : 'Our Services'}</h2>
          <span className="gold-line" />
          <p className="section-sub">
            {preview
              ? 'Every celebration deserves a personal touch. We offer a full suite of services tailored to your unique vision.'
              : 'Comprehensive event management solutions tailored to every occasion, budget, and vision.'}
          </p>
        </>
      )}
      <div className="services-grid">
        {services.map((s) => (
          <Link key={s.title} to="/contact" className="service-card" style={{ display: 'block' }}>
            <div className="service-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="learn-more">{ctaText}</div>
          </Link>
        ))}
      </div>
      {!preview && (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <h3 style={{ fontSize: 28, marginBottom: 16 }}>Ready to get started?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Book a free consultation with our team today.</p>
          <Link to="/contact" className="btn btn-gold btn-lg">Schedule a Consultation</Link>
        </div>
      )}
    </div>
  );
}
