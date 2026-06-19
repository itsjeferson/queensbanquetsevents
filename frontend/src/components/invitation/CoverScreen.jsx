import { parseEventDate } from '../../utils/eventDate';
import { getCoupleDisplayName } from '../../utils/invitationContent';

export default function CoverScreen({ event, invitation, onOpen, labels }) {
  const parsed = parseEventDate(event.event_date);
  const date = parsed
    ? parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : '';
  const coupleName = getCoupleDisplayName(event, invitation);

  return (
    <section className="inv-cover" id="cover">
      {invitation?.background_video ? (
        <video className="inv-cover-video" src={invitation.background_video} autoPlay muted loop playsInline />
      ) : invitation?.cover_image ? (
        <div className="inv-cover-bg" style={{ backgroundImage: `url(${invitation.cover_image})` }} />
      ) : (
        <div className="inv-cover-bg inv-cover-bg-fallback" />
      )}
      <div className="inv-cover-shade" />
      <div className="inv-cover-content">
        {invitation?.opening_line && (
          <p className="inv-subtitle inv-cover-opening">{invitation.opening_line}</p>
        )}
        {!invitation?.opening_line && labels?.together && (
          <p className="inv-subtitle inv-cover-opening">{labels.together}</p>
        )}

        {invitation?.hero_caption && (
          <p className="inv-tagline inv-cover-caption">{invitation.hero_caption}</p>
        )}

        <h1 className="inv-cover-couple">{coupleName}</h1>
        {date && <p className="inv-date">{date}</p>}
        <button type="button" className="inv-open-btn" onClick={onOpen}>
          Open Invitation
        </button>
      </div>
    </section>
  );
}
