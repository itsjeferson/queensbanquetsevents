import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { rsvpService } from '../../services/invitationService';
import { Spinner } from '../common/Loader/Loader';
import CoupleNameHeading from './CoupleNameHeading';

export default function RsvpFormPage({ event, invitation, onRsvpSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', phone: '', email: '', facebookLink: '', attendance: 'yes' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const coupleDisplay = getCoupleDisplayName(event, invitation);

  const handleRsvpSubmit = async (attendanceValue) => {
    if (!form.name || !form.phone || !form.email) {
      setFormError('Please fill out all required fields (Name, Phone, Email).');
      return;
    }
    setFormError('');
    setLoading(true);
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
        setSubmitted(true);
        if (attendanceValue === 'yes') {
          setTimeout(() => {
            onRsvpSuccess?.({ name: form.name, attendance: 'yes' });
          }, 2500);
        }
      }
    }
  };

  const handleBackToSaveTheDate = () => {
    const slug = event.slug || invitation.slug;
    navigate(`/savethedate/${encodeURIComponent(slug)}${location.search || ''}`);
  };

  return (
    <section className="inv-rsvp-page" id="rsvp-form-page">
      <div className="inv-rsvp-page-container">
        
        {!submitted ? (
          <form className="inv-rsvp-page-form" onSubmit={(e) => e.preventDefault()}>
            <header className="inv-rsvp-page-header">
              <span className="rsvp-page-subtitle">JOIN US IN CELEBRATING</span>
              {coupleDisplay && (
                <CoupleNameHeading name={coupleDisplay} className="rsvp-page-couple-names" />
              )}
              <h1 className="rsvp-page-title">RSVP</h1>
              <div className="rsvp-page-header-line"></div>
            </header>

            <div className="inv-rsvp-page-field">
              <label htmlFor="rsvp-page-guest-name">Fullname *</label>
              <input
                id="rsvp-page-guest-name"
                className="inv-rsvp-page-input"
                required
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
            </div>

            <div className="inv-rsvp-page-field">
              <label htmlFor="rsvp-page-guest-phone">PH Contact Number *</label>
              <input
                id="rsvp-page-guest-phone"
                className="inv-rsvp-page-input"
                required
                placeholder="e.g., 09171234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="tel"
              />
            </div>

            <div className="inv-rsvp-page-field">
              <label htmlFor="rsvp-page-guest-email">Email Address *</label>
              <input
                id="rsvp-page-guest-email"
                type="email"
                className="inv-rsvp-page-input"
                required
                placeholder="e.g., name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>

            <div className="inv-rsvp-page-field">
              <label htmlFor="rsvp-page-guest-fb">Facebook Link</label>
              <input
                id="rsvp-page-guest-fb"
                className="inv-rsvp-page-input"
                placeholder="e.g., facebook.com/username"
                value={form.facebookLink}
                onChange={(e) => setForm({ ...form, facebookLink: e.target.value })}
              />
            </div>

            {formError && <p className="inv-rsvp-page-error">{formError}</p>}

            <div className="inv-rsvp-page-action-buttons">
              <button 
                type="button" 
                className="inv-rsvp-page-btn-yes" 
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
                className="inv-rsvp-page-btn-no" 
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
              className="inv-rsvp-page-back-btn" 
              onClick={handleBackToSaveTheDate}
            >
              Back to Save the Date
            </button>
          </form>
        ) : (
          <div className="inv-rsvp-page-confirm-view">
            {form.attendance === 'yes' ? (
              <div className="rsvp-page-confirm-wrapper confirm-yes">
                <div className="rsvp-page-check-circle">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>RSVP Confirmed!</h3>
                <p>Thank you! We are excited to celebrate with you.</p>
                <p className="rsvp-page-redirect-hint">Opening your invitation...</p>
              </div>
            ) : (
              <div className="rsvp-page-confirm-wrapper confirm-no">
                <div className="rsvp-page-heart-circle">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3>Thank You!</h3>
                <p className="rsvp-page-confirm-msg-no">Thank you for letting us know. We're sorry you won't be able to make it to the wedding and we will definitely miss your presence. Can't wait to see you soon!</p>
                <button 
                  type="button" 
                  className="inv-rsvp-page-return-btn"
                  onClick={handleBackToSaveTheDate}
                >
                  Return to Save the Date
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
