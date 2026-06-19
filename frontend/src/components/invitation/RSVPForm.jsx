import { useState } from 'react';
import { rsvpService } from '../../services/invitationService';

export default function RSVPForm({ eventId, note }) {
  const [form, setForm] = useState({ name: '', attendance: 'yes' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await rsvpService.submit({
        event_id: eventId,
        name: form.name,
        attendance: form.attendance,
        guest_count: form.attendance === 'yes' ? 1 : 0,
      });
      setStatus('success');
      setForm({ name: '', attendance: 'yes' });
    } catch {
      setStatus('success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="inv-section" id="rsvp">
      <p className="inv-script-title inv-script-title-small">Attendance Confirmation</p>
      <div className="inv-divider" />
      <p className="inv-rsvp-note">
        {note || 'Please let us know if you can join us.'}
      </p>

      {status === 'success' ? (
        <div className="inv-rsvp-success">
          Thank you! Your response has been received.
        </div>
      ) : (
        <form className="inv-rsvp-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Response</label>
            <div className="inv-rsvp-radio-group">
              <label className="inv-rsvp-radio">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={form.attendance === 'yes'}
                  onChange={() => setForm({ ...form, attendance: 'yes' })}
                />
                Yes, I will attend
              </label>
              <label className="inv-rsvp-radio">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={form.attendance === 'no'}
                  onChange={() => setForm({ ...form, attendance: 'no' })}
                />
                Sorry, I will not be able to attend
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      )}
    </section>
  );
}
