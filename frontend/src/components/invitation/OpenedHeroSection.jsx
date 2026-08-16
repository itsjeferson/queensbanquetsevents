import { parseEventDate } from '../../utils/eventDate';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { formatSaveTheDateCompact } from '../../utils/saveTheDateFormat';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function OpenedHeroSection({ event, invitation, animateHero = true }) {
  const dateLabel = parseEventDate(event.event_date)
    ? formatSaveTheDateCompact(event.event_date)
    : '';
  const customHeroPhoto = resolveMediaUrl(invitation.opening_hero_image);
  const heroImage = customHeroPhoto || resolveMediaUrl(invitation.cover_image);

  // Only hide the text/date overlay when the client explicitly opts out
  const hideOverlay = Boolean(invitation.hide_hero_text_overlay);

  return (
    <section className={`inv-opened-hero${hideOverlay ? ' no-overlay' : ''}`}>
      {heroImage ? (
        <img src={heroImage} alt={getCoupleDisplayName(event, invitation)} className="inv-opened-hero-bg" />
      ) : (
        <div className="inv-opened-hero-bg inv-hero-placeholder" />
      )}
      {!hideOverlay && <div className="inv-opened-hero-overlay" />}
      {!hideOverlay && (
        <div className={`inv-opened-hero-content${animateHero ? ' inv-animate-rise' : ''}`}>
          <h1>{getCoupleDisplayName(event, invitation)}</h1>
          <div className="inv-opened-hero-line" />
          {dateLabel && <p className="inv-opened-hero-date">{dateLabel}</p>}
        </div>
      )}
    </section>
  );
}
