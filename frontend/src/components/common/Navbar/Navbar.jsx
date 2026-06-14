import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../../utils/constants';
import Button from '../Button/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAuth = ['/login', '/register'].includes(location.pathname);
  const isDashboard = location.pathname.startsWith('/client') || location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAuth || isDashboard) return null;

  return (
    <nav style={{ boxShadow: scrolled ? '0 2px 20px rgba(26,26,26,0.08)' : 'none' }}>
      <Link to="/" className="nav-logo">VE<span>L</span>URA</Link>
      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => (isActive ? 'active' : '')}
            end={link.path === '/'}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="nav-cta">
        <Link to="/login"><Button variant="outline">Sign In</Button></Link>
        <Link to="/register"><Button variant="gold">Book Now</Button></Link>
      </div>
    </nav>
  );
}
