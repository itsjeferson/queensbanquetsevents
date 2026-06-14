import { Link } from 'react-router-dom';
import { packages } from '../../../data/packages';
import { formatCurrency } from '../../../utils/currencyFormatter';
import Button from '../../common/Button/Button';
import { useBookings } from '../../../hooks/useBookings';

export default function Packages({ showHeader = true, showCustomCta = true }) {
  const { openBookingModal } = useBookings();

  return (
    <div className="section">
      {showHeader && (
        <>
          <div className="section-tag">Pricing</div>
          <h2 className="section-title">Our Packages</h2>
          <span className="gold-line" />
          <p className="section-sub">Transparent, all-inclusive packages designed to give you the best value for your celebration.</p>
        </>
      )}
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`package-card${pkg.featured ? ' featured' : ''}`}>
            <div className="package-header">
              <div className="package-name">{pkg.name}</div>
              <div className="package-desc">{pkg.description}</div>
              <div className="package-price">
                {formatCurrency(pkg.price)} <span>/ event</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Up to {pkg.maxGuests} guests</p>
            </div>
            <div className="package-body">
              <ul className="package-inclusions">
                {pkg.inclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button
                variant={pkg.featured ? 'gold' : 'outline'}
                style={{ width: '100%' }}
                onClick={() => openBookingModal(pkg)}
              >
                Book This Package
              </Button>
            </div>
          </div>
        ))}
      </div>
      {showCustomCta && (
        <div style={{ background: 'var(--beige)', borderRadius: 'var(--radius-lg)', padding: 40, marginTop: 60, textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, marginBottom: 12 }}>Need a Custom Package?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>We build bespoke packages tailored exactly to your event needs and budget.</p>
          <Link to="/contact"><Button variant="dark" size="lg">Request Custom Quote</Button></Link>
        </div>
      )}
    </div>
  );
}
