import { parseEventDate } from '../../utils/eventDate';
import FloralCornerFrame from './FloralCornerFrame';

function hasVenueContent(venue = {}) {
  return Boolean(
    venue.name?.trim()
    || venue.address?.trim()
    || venue.time?.trim()
    || venue.image?.trim()
    || venue.map_url?.trim(),
  );
}

function VenueCard({ label, venue }) {
  if (!hasVenueContent(venue)) return null;

  return (
    <article className="inv-venue-card">
      <span className="inv-venue-label">{label}</span>
      {venue.image && (
        venue.map_url ? (
          <a
            href={venue.map_url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${venue.name || label} on map`}
          >
            <img src={venue.image} alt={venue.name || label} className="inv-venue-image" />
          </a>
        ) : (
          <img src={venue.image} alt={venue.name || label} className="inv-venue-image" />
        )
      )}
      {venue.name && <h3>{venue.name}</h3>}
      {venue.time && <p className="inv-venue-time">{venue.time}</p>}
      {venue.address && <p className="inv-venue-address">{venue.address}</p>}
      {venue.map_url && (
        <a href={venue.map_url} target="_blank" rel="noreferrer" className="inv-map-btn">
          See Location
        </a>
      )}
    </article>
  );
}

export default function WeddingDetailsSection({ event, venue }) {
  const parsed = parseEventDate(event.event_date);
  const dateLabel = parsed
    ? parsed.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : '';

  const ceremony = venue?.ceremony;
  const reception = venue?.reception;
  const hasCeremony = hasVenueContent(ceremony);
  const hasReception = hasVenueContent(reception);

  if (!dateLabel && !hasCeremony && !hasReception) return null;

  return (
    <section className="inv-details-band" id="details">
      <div className="inv-details-card">
        <FloralCornerFrame className="inv-floral-frame-card">
          <p className="inv-script-title inv-script-title-small">Wedding Details</p>
          {dateLabel && <h2>{dateLabel}</h2>}
          <div className="inv-details-grid">
            {hasCeremony && <VenueCard label="Ceremony" venue={ceremony} />}
            {hasReception && <VenueCard label="Reception" venue={reception} />}
          </div>
        </FloralCornerFrame>
      </div>
    </section>
  );
}
