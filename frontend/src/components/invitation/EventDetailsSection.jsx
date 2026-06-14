export default function EventDetailsSection({ venue, dressCode, program }) {
  return (
    <>
      <section className="inv-section" id="details">
        <p className="inv-section-tag">Save The Date</p>
        <h2>Event Details</h2>
        <div className="inv-divider" />
        {dressCode && (
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
            Dress Code: <strong>{dressCode}</strong>
          </p>
        )}
        {venue && (
          <div className="inv-details-grid">
            {venue.ceremony && (
              <div className="inv-detail-card">
                <h3>Ceremony</h3>
                <p><strong>{venue.ceremony.name}</strong></p>
                <p>{venue.ceremony.address}</p>
                <p>{venue.ceremony.time}</p>
                {venue.ceremony.map_url && (
                  <a href={venue.ceremony.map_url} target="_blank" rel="noreferrer" className="inv-map-btn">
                    Get Directions
                  </a>
                )}
              </div>
            )}
            {venue.reception && (
              <div className="inv-detail-card">
                <h3>Reception</h3>
                <p><strong>{venue.reception.name}</strong></p>
                <p>{venue.reception.address}</p>
                <p>{venue.reception.time}</p>
                {venue.reception.map_url && (
                  <a href={venue.reception.map_url} target="_blank" rel="noreferrer" className="inv-map-btn">
                    Get Directions
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {program?.length > 0 && (
        <section className="inv-section-full" id="program">
          <div className="inv-section">
            <p className="inv-section-tag">Schedule</p>
            <h2>Program</h2>
            <div className="inv-divider" />
            <div className="inv-program-list">
              {program.map((item, i) => (
                <div key={i} className="inv-program-item">
                  <span className="inv-program-time">{item.time}</span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
