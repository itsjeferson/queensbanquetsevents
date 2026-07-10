import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { formatSaveTheDateCompact, getSaveTheDatePhoto } from '../../utils/saveTheDateFormat';
import CoupleNameHeading from './CoupleNameHeading';
import { rsvpService } from '../../services/invitationService';
import { Spinner } from '../common/Loader/Loader';

export default function SaveTheDateScreen({ event, invitation, rsvpForceForm, onRsvpSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [rsvpStep, setRsvpStep] = useState(rsvpForceForm ? 'form' : 'info'); // 'info', 'form', 'confirm'
  const [form, setForm] = useState({ name: '', phone: '', email: '', facebookLink: '', attendance: 'yes' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setRsvpStep(rsvpForceForm ? 'form' : 'info');
  }, [rsvpForceForm]);

  const coupleDisplay = getCoupleDisplayName(event, invitation);
  const dateLine = formatSaveTheDateCompact(event.event_date);
  const photoUrl = getSaveTheDatePhoto(invitation);

  const handleRsvpSubmit = async (attendanceValue) => {
    if (!form.name || !form.phone || !form.email) {
      setFormError('Please fill out all required fields (Name, Phone, Email).');
      return;
    }
    setFormError('');
    setLoading(true);
    
    // Update local state to trigger correct confirmation card template
    setForm(prev => ({ ...prev, attendance: attendanceValue }));

    let hasDuplicateError = false;
    try {
      await rsvpService.submit({
        event_id: event.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        attendance: attendanceValue,
        message: form.facebookLink ? `Facebook: ${form.facebookLink}` : '',
        guest_count: attendanceValue === 'yes' ? 1 : 0,
      });
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.error === 'duplicate') {
        setFormError(err.response.data.message || 'You have already submitted an RSVP for this invitation.');
        hasDuplicateError = true;
      }
    } finally {
      setLoading(false);
      if (!hasDuplicateError) {
        setRsvpStep('confirm');
        if (attendanceValue === 'yes') {
          setTimeout(() => {
            onRsvpSuccess?.({ name: form.name, attendance: 'yes' });
          }, 2500);
        }
      }
    }
  };

  const handleReturn = () => {
    setForm({ name: '', phone: '', email: '', facebookLink: '', attendance: 'yes' });
    const slug = event.slug || invitation.slug;
    navigate(`/savethedate/${encodeURIComponent(slug)}${location.search || ''}`);
  };

  const handleRsvpTrigger = () => {
    const slug = event.slug || invitation.slug;
    navigate(`/savethedate/${encodeURIComponent(slug)}/rsvp${location.search || ''}`);
  };

  const handleBackToDetails = () => {
    const slug = event.slug || invitation.slug;
    navigate(`/savethedate/${encodeURIComponent(slug)}${location.search || ''}`);
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
          {rsvpStep === 'info' && (
            <div className="inv-std-info-view">
              <button 
                type="button" 
                className="inv-std-rsvp-trigger-btn"
                onClick={handleRsvpTrigger}
              >
                RSVP
              </button>
            </div>
          )}

          {rsvpStep === 'form' && (
            <form className="inv-std-classic-form" onSubmit={(e) => e.preventDefault()}>
              <h2 className="inv-std-classic-rsvp-title">RSVP</h2>
              
              <div className="inv-std-classic-field">
                <label className="inv-std-classic-label" htmlFor="std-guest-name">Fullname *</label>
                <input
                  id="std-guest-name"
                  className="inv-std-classic-input"
                  required
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                />
              </div>

              <div className="inv-std-classic-field">
                <label className="inv-std-classic-label" htmlFor="std-guest-phone">PH Contact Number *</label>
                <input
                  id="std-guest-phone"
                  className="inv-std-classic-input"
                  required
                  placeholder="e.g., 09171234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  autoComplete="tel"
                />
              </div>

              <div className="inv-std-classic-field">
                <label className="inv-std-classic-label" htmlFor="std-guest-email">Email Address *</label>
                <input
                  id="std-guest-email"
                  type="email"
                  className="inv-std-classic-input"
                  required
                  placeholder="e.g., name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>

              <div className="inv-std-classic-field">
                <label className="inv-std-classic-label" htmlFor="std-guest-fb">Facebook Link</label>
                <input
                  id="std-guest-fb"
                  className="inv-std-classic-input"
                  placeholder="e.g., facebook.com/username"
                  value={form.facebookLink}
                  onChange={(e) => setForm({ ...form, facebookLink: e.target.value })}
                />
              </div>

              {formError && <p className="inv-std-form-error">{formError}</p>}

              <div className="inv-std-action-buttons">
                <button 
                  type="button" 
                  className="inv-std-btn-yes" 
                  disabled={loading}
                  onClick={() => handleRsvpSubmit('yes')}
                >
                  {loading && form.attendance === 'yes' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Spinner size="sm" tone="light" />
                      <span>Confirming...</span>
                    </span>
                  ) : 'Yes, I will attend'}
                </button>
                <button 
                  type="button" 
                  className="inv-std-btn-no" 
                  disabled={loading}
                  onClick={() => handleRsvpSubmit('no')}
                >
                  {loading && form.attendance === 'no' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Spinner size="sm" tone="dark" />
                      <span>Declining...</span>
                    </span>
                  ) : 'Sorry, I will not be able to attend'}
                </button>
              </div>

              <button 
                type="button" 
                className="inv-std-back-link" 
                onClick={handleBackToDetails}
              >
                Back to Details
              </button>
            </form>
          )}

          {rsvpStep === 'confirm' && (
            <div className="inv-std-confirm-view">
              {form.attendance === 'yes' ? (
                <div className="confirm-icon-wrapper confirm-yes">
                  <div className="confirm-check-circle">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>RSVP Confirmed!</h3>
                  <p>Thank you! We are excited to celebrate with you.</p>
                  <p className="confirm-redirect-hint">Opening your invitation...</p>
                </div>
              ) : (
                <div className="confirm-icon-wrapper confirm-no">
                  <div className="confirm-heart-circle">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3>Thank You!</h3>
                  <p className="confirm-msg-no">Thank you for letting us know. We're sorry you won't be able to make it to the wedding and we will definitely miss your presence. Can't wait to see you soon!</p>
                  <button 
                    type="button" 
                    className="inv-std-btn-return"
                    onClick={handleReturn}
                  >
                    Return to Save the Date
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
