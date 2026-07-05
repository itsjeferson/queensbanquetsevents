import { useState } from 'react';
import { parseEventDate } from '../../utils/eventDate';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { isDirectVideoUrl, resolveMediaUrl } from '../../utils/mediaUrl';
import { Spinner } from '../common/Loader/Loader';

const OPEN_DELAY_MS = 900;

function getOpenDelay() {
  if (typeof window === 'undefined') return OPEN_DELAY_MS;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : OPEN_DELAY_MS;
}

export default function CoverScreen({ event, invitation, onOpen, labels }) {
  const [opening, setOpening] = useState(false);
  const parsed = parseEventDate(event.event_date);
  const date = parsed
    ? parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : '';
  const coupleName = getCoupleDisplayName(event, invitation);
  const coverImage = resolveMediaUrl(invitation?.cover_image);
  const backgroundVideo = resolveMediaUrl(invitation?.background_video);
  const useVideo = Boolean(backgroundVideo) && isDirectVideoUrl(backgroundVideo);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => onOpen?.(), getOpenDelay());
  };

  return (
    <section className="inv-cover" id="cover">
      {useVideo ? (
        <video className="inv-cover-video" src={backgroundVideo} autoPlay muted loop playsInline />
      ) : coverImage ? (
        <img src={coverImage} alt="" className="inv-cover-bg" />
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
        <button type="button" className="inv-open-btn" onClick={handleOpen} disabled={opening} aria-busy={opening}>
          {opening ? (
            <span className="btn-loading">
              <Spinner size="sm" tone="dark" />
              <span>Opening invitation...</span>
            </span>
          ) : 'Open Invitation'}
        </button>
      </div>
    </section>
  );
}
