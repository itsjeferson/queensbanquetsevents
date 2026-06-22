import { getCoupleDisplayName } from '../../utils/invitationContent';
import { formatSaveTheDateLine, getSaveTheDateLocations } from '../../utils/saveTheDateFormat';
import Countdown from './Countdown';
import LaurelWreath from './LaurelWreath';
import RSVPForm from './RSVPForm';
import FloralCornerFrame from './FloralCornerFrame';

export default function SaveTheDateScreen({ event, invitation, onRsvpSuccess }) {
  const coupleDisplay = getCoupleDisplayName(event, invitation);
  const coupleName = coupleDisplay.toUpperCase();
  const dateLine = formatSaveTheDateLine(event.event_date);
  const locations = getSaveTheDateLocations(invitation);
  const tagline = invitation.std_message?.trim() || 'FOR THE WEDDING OF';
  const rsvpNote = invitation.rsvp_note?.trim()
    || `You are special to us, ${coupleDisplay}. Kindly confirm your attendance so we may prepare for your presence on our wedding day.`;

  return (
    <section className="inv-std" id="save-the-date">
      <FloralCornerFrame className="inv-std-splash">
        <div className="inv-std-wreath-wrap">
          <LaurelWreath className="inv-std-wreath" />
          <div className="inv-std-wreath-title">
            <span className="inv-std-wreath-word inv-std-wreath-word-lg">SAVE</span>
            <span className="inv-std-wreath-word inv-std-wreath-word-sm">THE</span>
            <span className="inv-std-wreath-word inv-std-wreath-word-lg">DATE</span>
          </div>
        </div>
        <p className="inv-std-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
        </p>
      </FloralCornerFrame>

      <div className="inv-std-details">
        <FloralCornerFrame className="inv-floral-frame-paper">
          <div className="inv-std-paper">
          <p className="inv-std-tagline">{tagline.toUpperCase()}</p>
          <h1 className="inv-std-couple">{coupleName}</h1>
          {dateLine && <p className="inv-std-date">{dateLine}</p>}
          {locations.length > 0 && (
            <div className="inv-std-venues">
              {locations.map((location) => (
                <article key={location.key} className="inv-std-venue-card">
                  {location.label && (
                    <span className="inv-std-venue-label">{location.label}</span>
                  )}
                  {location.image && (
                    <div className="inv-std-venue-photo">
                      {location.mapUrl ? (
                        <a
                          href={location.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${location.name || location.label || 'venue'} on map`}
                        >
                          <img
                            src={location.image}
                            alt={location.name || location.label || 'Venue'}
                          />
                        </a>
                      ) : (
                        <img
                          src={location.image}
                          alt={location.name || location.label || 'Venue'}
                        />
                      )}
                    </div>
                  )}
                  {(location.name || location.text) && (
                    <p className="inv-std-venue-name">
                      {(location.name || location.text).toUpperCase()}
                    </p>
                  )}
                  {location.address && (
                    <p className="inv-std-venue-address">{location.address}</p>
                  )}
                  {location.time && (
                    <p className="inv-std-venue-time">{location.time.toUpperCase()}</p>
                  )}
                  {location.mapUrl && (
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inv-std-venue-map"
                    >
                      See Location
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
          <p className="inv-std-follow">FORMAL INVITATION TO FOLLOW</p>

          <div className="inv-std-countdown">
            <p className="inv-std-section-label">THE COUNTDOWN</p>
            <Countdown eventDate={event.event_date} />
          </div>

          <div className="inv-std-rsvp">
            <RSVPForm
              eventId={event.id}
              note={rsvpNote}
              onSuccess={onRsvpSuccess}
              submitLabel="Confirm & View Invitation"
              variant="save-the-date"
            />
          </div>
          </div>
        </FloralCornerFrame>
      </div>
    </section>
  );
}
