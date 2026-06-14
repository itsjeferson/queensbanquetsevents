export default function CoverScreen({ event, invitation, onOpen, labels }) {
  const date = new Date(event.event_date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <section className="inv-cover" id="cover">
      {invitation?.cover_image && (
        <div className="inv-cover-bg" style={{ backgroundImage: `url(${invitation.cover_image})` }} />
      )}
      <div className="inv-cover-content">
        <div className="inv-cover-ornament">✦ ✦ ✦</div>
        <p className="inv-subtitle">{labels?.together || 'Together With Their Families'}</p>
        <h1>{event.event_name}</h1>
        <p className="inv-tagline">{labels?.invite || 'Invite You To Celebrate'}</p>
        <p className="inv-date">{date}</p>
        <button type="button" className="inv-open-btn" onClick={onOpen}>
          Open Invitation
        </button>
      </div>
    </section>
  );
}
