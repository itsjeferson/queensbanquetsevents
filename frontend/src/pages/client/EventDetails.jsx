import { Link } from 'react-router-dom';
import EventTimeline from '../../components/client/EventTimeline/EventTimeline';

const timeline = [
  { title: 'Booking Confirmed', date: 'Nov 1, 2024' },
  { title: 'Downpayment Received', date: 'Nov 1, 2024' },
  { title: 'Venue Visit', date: 'Dec 10, 2024 — 2:00 PM' },
  { title: 'Wedding Day', date: 'Dec 28, 2024' },
];

export default function EventDetails() {
  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Wedding — Dec 28, 2024</h1>
          <p>Signature Package • 120 guests • Status: Confirmed</p>
        </div>
        <Link to="/client/invitations/builder" className="btn btn-gold">Create Invitation</Link>
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <h3>Event Details</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Booking ID: #VE-2024-001</p>
          <p><strong>Coordinator:</strong> Isabella Santos</p>
          <p><strong>Venue:</strong> Garden Estate, Taguig</p>
          <p><strong>Package:</strong> Signature — ₱95,000</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/client/invitations/1" className="btn btn-outline">Manage Invitation</Link>
            <Link to="/client/invitations/1/guests" className="btn btn-outline">Guest List</Link>
            <Link to="/client/invitations/1/rsvp" className="btn btn-outline">RSVP Dashboard</Link>
            <a href="/invite/john-jane" target="_blank" rel="noreferrer" className="btn btn-gold">Preview Invitation</a>
          </div>
        </div>
        <div className="card-widget">
          <h3>Event Progress</h3>
          <EventTimeline items={timeline} />
        </div>
      </div>
    </>
  );
}
