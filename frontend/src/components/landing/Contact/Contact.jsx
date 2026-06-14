import { CONTACT_INFO, EVENT_TYPES } from '../../../utils/constants';
import Button from '../../common/Button/Button';
import { useBookings } from '../../../hooks/useBookings';

export default function Contact() {
  const { openBookingModal } = useBookings();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will respond within 24 hours.');
  };

  return (
    <div className="section">
      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3 style={{ fontSize: 24, marginBottom: 8 }}>Send Us a Message</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>We&apos;ll respond within 24 hours.</p>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input type="text" placeholder="Maria" required /></div>
            <div className="form-group"><label>Last Name</label><input type="text" placeholder="Santos" required /></div>
          </div>
          <div className="form-group"><label>Email Address</label><input type="email" placeholder="maria@email.com" required /></div>
          <div className="form-group">
            <label>Event Type</label>
            <select>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Event Date</label><input type="date" /></div>
            <div className="form-group"><label>Guest Count</label><input type="number" placeholder="150" /></div>
          </div>
          <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your dream event..." /></div>
          <Button type="submit" variant="gold" size="lg" style={{ width: '100%' }}>Send Message</Button>
        </form>
        <div className="contact-info">
          <h3>We&apos;d Love to Hear From You</h3>
          <p>Whether you&apos;re just exploring ideas or ready to book, our team is here to help you every step of the way.</p>
          <div className="contact-detail">
            <div className="contact-icon">📍</div>
            <div><strong>Address</strong><span>{CONTACT_INFO.address}</span></div>
          </div>
          <div className="contact-detail">
            <div className="contact-icon">📞</div>
            <div><strong>Phone</strong><span>{CONTACT_INFO.phone}</span></div>
          </div>
          <div className="contact-detail">
            <div className="contact-icon">✉️</div>
            <div><strong>Email</strong><span>{CONTACT_INFO.email}</span></div>
          </div>
          <div className="contact-detail">
            <div className="contact-icon">🕐</div>
            <div><strong>Hours</strong><span>{CONTACT_INFO.hours}</span></div>
          </div>
          <div style={{ background: 'var(--beige)', borderRadius: 'var(--radius-lg)', padding: 28, marginTop: 32 }}>
            <strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>Book a Free Consultation</strong>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Meet with our lead planner to discuss your vision at no cost.</p>
            <Button variant="gold" style={{ width: '100%' }} onClick={() => openBookingModal()}>Schedule Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
