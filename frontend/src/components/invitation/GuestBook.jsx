import { useState } from 'react';
import { guestMessageService } from '../../services/invitationService';

export default function GuestBook({ eventId, messages: initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [form, setForm] = useState({ guest_name: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await guestMessageService.submit({ event_id: eventId, ...form });
      setMessages([{ ...form, created_at: new Date().toISOString() }, ...messages]);
      setForm({ guest_name: '', message: '' });
    } catch {
      setMessages([{ ...form, created_at: new Date().toISOString() }, ...messages]);
      setForm({ guest_name: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="inv-section-full" id="guestbook">
      <div className="inv-section">
        <p className="inv-section-tag">Wishes</p>
        <h2>Guest Book</h2>
        <div className="inv-divider" />

        <form className="inv-rsvp-form" onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
          <div className="form-row">
            <div className="form-group">
              <label>Your Name</label>
              <input required value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Leave a Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Share your blessings..." />
          </div>
          <button type="submit" className="btn btn-outline" disabled={loading}>
            {loading ? 'Posting...' : 'Leave a Message'}
          </button>
        </form>

        {messages.length > 0 && (
          <div className="inv-messages-list">
            {messages.map((msg, i) => (
              <div key={i} className="inv-message-card">
                <strong>{msg.guest_name}</strong>
                <p>&ldquo;{msg.message}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
