import { useState } from 'react';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { formatSaveTheDateCompact, getSaveTheDatePhoto } from '../../utils/saveTheDateFormat';
import CoupleNameHeading from './CoupleNameHeading';
import { rsvpService } from '../../services/invitationService';
import { Spinner } from '../common/Loader/Loader';

export default function SaveTheDateScreen({ event, invitation, onRsvpSuccess }) {
  const [form, setForm] = useState({ name: '', attendance: 'yes' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const coupleDisplay = getCoupleDisplayName(event, invitation);
  const dateLine = formatSaveTheDateCompact(event.event_date);
  const photoUrl = getSaveTheDatePhoto(invitation);

  const handleSubmit = async (eventSubmit) => {
    eventSubmit.preventDefault();
    if (loading || submitted) return;

    setLoading(true);
    try {
      await rsvpService.submit({
        event_id: event.id,
        name: form.name,
        attendance: form.attendance,
        guest_count: form.attendance === 'yes' ? 1 : 0,
      });
    } catch {
      // Allow guests to continue even if the API is temporarily unavailable.
    } finally {
      setLoading(false);
      setSubmitted(true);
      onRsvpSuccess?.({ name: form.name, attendance: form.attendance });
    }
  };

  return (
    <section className="inv-std inv-std-classic" id="save-the-date">
      <div className="inv-std-classic-bg" aria-hidden="true">
        {photoUrl ? (
          <img className="inv-std-classic-photo" src={photoUrl} alt="" />
        ) : (
          <div className="inv-std-classic-photo inv-std-classic-photo-fallback" />
        )}
        <div className="inv-std-classic-overlay" />
        <div className="inv-std-classic-grain" />
      </div>

      <div className="inv-std-classic-content">
        <header className="inv-std-classic-header">
          <div className="inv-std-classic-title" aria-label="Save the Date">
            <span className="inv-std-classic-title-save">SAVE</span>
            <span className="inv-std-classic-title-the">the</span>
            <span className="inv-std-classic-title-date">DATE</span>
          </div>

          {dateLine && <p className="inv-std-classic-wedding-date">{dateLine}</p>}

          {coupleDisplay && (
            <div className="inv-std-classic-couple-block">
              <p className="inv-std-classic-for">for</p>
              <CoupleNameHeading name={coupleDisplay} className="inv-std-classic-couple" />
            </div>
          )}
        </header>

        <div className="inv-std-classic-rsvp">
          <h2 className="inv-std-classic-rsvp-title">Attendance Confirmation</h2>

          {submitted ? (
            <p className="inv-std-classic-rsvp-success">Thank you! Opening your invitation...</p>
          ) : (
            <form className="inv-std-classic-form" onSubmit={handleSubmit}>
              <div className="inv-std-classic-field">
                <label className="inv-std-classic-label" htmlFor="std-guest-name">Name</label>
                <input
                  id="std-guest-name"
                  className="inv-std-classic-input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                />
              </div>

              <fieldset className="inv-std-classic-options">
                <legend className="sr-only">Will you attend?</legend>
                <label className="inv-std-classic-option">
                  <input
                    type="radio"
                    name="std-attendance"
                    value="yes"
                    checked={form.attendance === 'yes'}
                    onChange={() => setForm({ ...form, attendance: 'yes' })}
                  />
                  <span className="inv-std-classic-option-box" aria-hidden="true" />
                  <span className="inv-std-classic-option-text">Yes, I will attend</span>
                </label>
                <label className="inv-std-classic-option">
                  <input
                    type="radio"
                    name="std-attendance"
                    value="no"
                    checked={form.attendance === 'no'}
                    onChange={() => setForm({ ...form, attendance: 'no' })}
                  />
                  <span className="inv-std-classic-option-box" aria-hidden="true" />
                  <span className="inv-std-classic-option-text">Sorry, I will not be able to attend</span>
                </label>
              </fieldset>

              <button type="submit" className="inv-std-classic-submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <Spinner size="sm" tone="light" />
                    <span>Sending...</span>
                  </span>
                ) : 'Confirm RSVP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
