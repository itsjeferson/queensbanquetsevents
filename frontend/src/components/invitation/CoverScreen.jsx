export default function CoverScreen({ event, invitation, onOpen, labels }) {
  const date = new Date(event.event_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
        <p className="inv-subtitle">{invitation?.opening_line || 'With great joy, we invite you'}</p>
        <p className="inv-tagline">{invitation?.hero_caption || labels?.together || 'Together With Their Families'}</p>
        <h1>{event.event_name}</h1>
        <p className="inv-date">{date}</p>
        <button type="button" className="inv-open-btn" onClick={onOpen}>
          Open Invitation
        </button>
      </div>
    </section>
  );
}
