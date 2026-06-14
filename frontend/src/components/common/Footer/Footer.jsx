import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../../../utils/constants';

export default function Footer({ simple = false }) {
  if (simple) {
    return (
      <footer className="footer-simple">
        <div className="footer-inner">
          <div className="footer-bottom">
            <p>© 2024 Velura Events. All rights reserved.</p>
            <p>Crafted with luxury in mind</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">VE<span style={{ color: 'var(--gold)' }}>L</span>URA</div>
            <p>Premium event management crafting unforgettable moments since 2012. Your vision, our expertise.</p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <span>Weddings</span>
            <span>Corporate</span>
            <span>Debuts</span>
            <span>Catering</span>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <span>📍 Metro Manila, PH</span>
            <span>📞 {CONTACT_INFO.phone}</span>
            <span>✉️ {CONTACT_INFO.email}</span>
            <span>🕐 Mon–Sat, 9AM–6PM</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Velura Events. All rights reserved.</p>
          <p>Designed with ♥ for luxury experiences</p>
        </div>
      </div>
    </footer>
  );
}
