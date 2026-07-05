import { parseEventDate } from '../../utils/eventDate';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function OpenedHeroSection({ event, invitation, animateHero = true }) {
  const parsed = parseEventDate(event.event_date);
  const dateLabel = parsed
    ? parsed.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : '';
  const heroImage = resolveMediaUrl(invitation.opening_hero_image || invitation.cover_image);

  return (
    <section className="inv-opened-hero">
      {heroImage ? (
        <img src={heroImage} alt={getCoupleDisplayName(event, invitation)} className="inv-opened-hero-bg" />
      ) : (
        <div className="inv-opened-hero-bg inv-hero-placeholder" />
      )}
      <div className="inv-opened-hero-overlay" />
      <div className={`inv-opened-hero-content${animateHero ? ' inv-animate-rise' : ''}`}>
        <h1>{getCoupleDisplayName(event, invitation)}</h1>
        <div className="inv-opened-hero-line" />
        {dateLabel && <p className="inv-opened-hero-date">{dateLabel}</p>}
      </div>
    </section>
  );
}
