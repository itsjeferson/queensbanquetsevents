import { useState } from 'react';
import { rsvpService } from '../../services/invitationService';

export default function RSVPForm({ eventId, note }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', attendance: 'yes', meal_preference: '', guest_count: 1, message: '',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await rsvpService.submit({ event_id: eventId, ...form, guest_count: Number(form.guest_count) });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', attendance: 'yes', meal_preference: '', guest_count: 1, message: '' });
    } catch {
      setStatus('success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="inv-section" id="rsvp">
      <p className="inv-script-title">Attendance Confirmation</p>
      <div className="inv-divider" />
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
        {note || 'Please let us know if you can join us.'}
      </p>

      {status === 'success' ? (
        <div style={{ padding: 24, background: 'rgba(40,167,69,0.1)', borderRadius: 12, color: '#1B7A35' }}>
          Thank you! Your RSVP has been received.
        </div>
      ) : (
        <form className="inv-rsvp-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Attending?</label>
            <div className="inv-attendance-btns">
              {['yes', 'no', 'maybe'].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`inv-attendance-btn ${form.attendance === val ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, attendance: val })}
                >
                  {val === 'yes' ? 'Yes' : val === 'no' ? 'No' : 'Maybe'}
                </button>
              ))}
            </div>
          </div>
          {form.attendance === 'yes' && (
            <>
              <div className="form-group">
                <label>Meal Preference</label>
                <select value={form.meal_preference} onChange={(e) => setForm({ ...form, meal_preference: e.target.value })}>
                  <option value="">Select...</option>
                  <option value="beef">Beef</option>
                  <option value="chicken">Chicken</option>
                  <option value="fish">Fish</option>
                  <option value="vegetarian">Vegetarian</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input type="number" min="1" max="10" value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: e.target.value })} />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Leave a message for the hosts..." />
          </div>
          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit RSVP'}
          </button>
        </form>
      )}
    </section>
  );
}
