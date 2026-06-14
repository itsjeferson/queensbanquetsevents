import Modal from './Modal';
import Button from '../Button/Button';
import { useBookings } from '../../../hooks/useBookings';
import { packages } from '../../../data/packages';
import { EVENT_TYPES } from '../../../utils/constants';

export default function BookingModal() {
  const { bookingModalOpen, closeBookingModal, selectedPackage } = useBookings();

  const handleSubmit = () => {
    closeBookingModal();
    alert('Booking request submitted! We will confirm within 24 hours.');
  };

  return (
    <Modal
      isOpen={bookingModalOpen}
      onClose={closeBookingModal}
      title="Book an Event"
      subtitle="Fill out the form to request your event booking."
    >
      <div className="booking-steps">
        <div className="booking-step"><div className="step-circle done">1</div><div className="step-line done" /></div>
        <div className="booking-step"><div className="step-circle active">2</div><div className="step-line" /></div>
        <div className="booking-step"><div className="step-circle">3</div></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 32 }}>
        <span className="step-label">Event Details</span>
        <span className="step-label" style={{ color: 'var(--gold-dark)', fontWeight: 500 }}>Package</span>
        <span className="step-label">Confirm</span>
      </div>
      <div className="form-group">
        <label>Event Type</label>
        <select>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Event Date</label><input type="date" /></div>
        <div className="form-group"><label>Guest Count</label><input type="number" placeholder="100" /></div>
      </div>
      <div className="form-group">
        <label>Select Package</label>
        <select defaultValue={selectedPackage?.id || ''}>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — ₱{p.price.toLocaleString()}</option>
          ))}
          <option value="custom">Custom Package</option>
        </select>
      </div>
      <div className="form-group">
        <label>Special Requests</label>
        <textarea placeholder="Any special themes, requirements, or notes..." />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={closeBookingModal}>Cancel</Button>
        <Button variant="gold" style={{ flex: 2 }} onClick={handleSubmit}>Submit Booking Request</Button>
      </div>
    </Modal>
  );
}
