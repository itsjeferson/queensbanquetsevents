import { useEffect, useState } from 'react';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import {
  formatSaveTheDateCompact,
  getSaveTheDateLocationLine,
  getSaveTheDatePhoto,
  getStdPhotoLayout,
} from '../../utils/saveTheDateFormat';
import CoupleNameHeading from './CoupleNameHeading';
import RSVPForm from './RSVPForm';
import { Spinner } from '../common/Loader/Loader';

const RSVP_BUTTON_DELAY_MIN_MS = 2000;
const RSVP_BUTTON_DELAY_MAX_MS = 4000;
const RSVP_CONFIRM_DELAY_MS = 800;

function getRsvpButtonRevealDelay() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 400;

  const range = RSVP_BUTTON_DELAY_MAX_MS - RSVP_BUTTON_DELAY_MIN_MS;
  return RSVP_BUTTON_DELAY_MIN_MS + Math.floor(Math.random() * (range + 1));
}

function getRsvpConfirmDelay() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion ? 200 : RSVP_CONFIRM_DELAY_MS;
}

export default function SaveTheDateScreen({ event, invitation, onRsvpSuccess }) {
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [showRsvpButton, setShowRsvpButton] = useState(false);
  const [confirmingRsvp, setConfirmingRsvp] = useState(false);
  const [photoLayout, setPhotoLayout] = useState(getStdPhotoLayout());
  const coupleDisplay = getCoupleDisplayName(event, invitation);
  const dateLine = formatSaveTheDateCompact(event.event_date);
  const locationLine = getSaveTheDateLocationLine(invitation);
  const photoUrl = getSaveTheDatePhoto(invitation);
  const heading = invitation.std_message?.trim() || 'Save the Date';
  const rsvpNote = invitation.rsvp_note?.trim()
    || 'You are special to us. Kindly confirm your attendance below.';

  useEffect(() => {
    setPhotoLayout(getStdPhotoLayout());
  }, [photoUrl]);

  const handlePhotoLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setPhotoLayout(getStdPhotoLayout(naturalWidth, naturalHeight));
  };

  const handleConfirmRsvp = () => {
    if (confirmingRsvp || !showRsvpButton) return;
    setConfirmingRsvp(true);
    window.setTimeout(() => {
      setShowRsvpForm(true);
      setConfirmingRsvp(false);
    }, getRsvpConfirmDelay());
  };

  useEffect(() => {
    if (showRsvpForm) {
      setShowRsvpButton(false);
      return undefined;
    }

    setShowRsvpButton(false);
    const timer = window.setTimeout(() => setShowRsvpButton(true), getRsvpButtonRevealDelay());
    return () => window.clearTimeout(timer);
  }, [showRsvpForm, photoUrl]);

  if (showRsvpForm) {
    return (
      <section className="inv-std inv-std-modern inv-std-modern-rsvp-view" id="save-the-date">
        <div className="inv-std-modern-rsvp-panel">
          <button
            type="button"
            className="inv-std-modern-back"
            onClick={() => setShowRsvpForm(false)}
          >
            Back
          </button>
          <RSVPForm
            eventId={event.id}
            note={rsvpNote}
            onSuccess={onRsvpSuccess}
            submitLabel="Confirm & View Invitation"
            variant="save-the-date"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="inv-std inv-std-modern" id="save-the-date">
      <div className="inv-std-modern-media">
        {photoUrl ? (
          <img
            className="inv-std-modern-photo"
            src={photoUrl}
            alt={coupleDisplay || 'Couple photo'}
            onLoad={handlePhotoLoad}
            style={{ objectPosition: photoLayout.objectPosition }}
          />
        ) : (
          <div className="inv-std-modern-photo inv-std-modern-photo-fallback" aria-hidden="true" />
        )}

        <div className="inv-std-modern-shade" aria-hidden="true" />

        <div className="inv-std-modern-card">
          <div className="inv-std-modern-content">
            <p className="inv-std-modern-kicker">{heading}</p>
            {dateLine && <p className="inv-std-modern-date">{dateLine}</p>}
            {coupleDisplay && (
              <CoupleNameHeading name={coupleDisplay} className="inv-std-modern-couple" />
            )}
            {locationLine && (
              <>
                <div className="inv-std-modern-divider" aria-hidden="true" />
                <p className="inv-std-modern-location">{locationLine}</p>
              </>
            )}
          </div>
        </div>

        <div
          className="inv-std-modern-actions"
          style={{ top: photoLayout.buttonTop }}
        >
          <button
            type="button"
            className={`inv-std-modern-rsvp-btn${showRsvpButton ? ' inv-std-modern-rsvp-btn--visible' : ''}${confirmingRsvp ? ' inv-std-modern-rsvp-btn--loading' : ''}`}
            onClick={handleConfirmRsvp}
            disabled={!showRsvpButton || confirmingRsvp}
            aria-busy={confirmingRsvp}
            aria-hidden={!showRsvpButton}
            tabIndex={showRsvpButton ? 0 : -1}
          >
            {confirmingRsvp ? (
              <span className="btn-loading">
                <Spinner size="sm" tone="dark" />
                <span>Loading RSVP...</span>
              </span>
            ) : 'CONFIRM RSVP'}
          </button>
        </div>
      </div>
    </section>
  );
}
