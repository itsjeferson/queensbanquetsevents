import { parseEventDate } from '../../utils/eventDate';

function VenueCard({ label, venue }) {
  if (!venue?.name?.trim() && !venue?.address?.trim() && !venue?.time?.trim()) return null;

  return (
    <article className="inv-venue-card">
      <span className="inv-venue-label">{label}</span>
      {venue.image && <img src={venue.image} alt={venue.name || label} className="inv-venue-image" />}
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
  const hasCeremony = ceremony?.name || ceremony?.address || ceremony?.time;
  const hasReception = reception?.name || reception?.address || reception?.time;

  if (!dateLabel && !hasCeremony && !hasReception) return null;

  return (
    <section className="inv-details-band" id="details">
      <div className="inv-details-card">
        <p className="inv-script-title inv-script-title-small">Wedding Details</p>
        {dateLabel && <h2>{dateLabel}</h2>}
        <div className="inv-details-grid">
          {hasCeremony && <VenueCard label="Ceremony" venue={ceremony} />}
          {hasReception && <VenueCard label="Reception" venue={reception} />}
        </div>
      </div>
    </section>
  );
}
