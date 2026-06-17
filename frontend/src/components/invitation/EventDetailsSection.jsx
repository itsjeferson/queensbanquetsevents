export default function EventDetailsSection({ event, venue, dressCode, program }) {
  const date = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <section className="inv-details-band" id="details">
        <div className="inv-details-card">
          <p className="inv-script-title">Wedding Details</p>
          <h2>{date}</h2>
          {dressCode && <p className="inv-muted">Dress Code: <strong>{dressCode}</strong></p>}

          {venue && (
            <div className="inv-details-grid">
              {['ceremony', 'reception'].map((type) => {
                const item = venue[type];
                if (!item?.name?.trim() && !item?.address?.trim() && !item?.time?.trim()) return null;
                return (
                  <div key={type} className="inv-detail-card">
                    <span>{type}</span>
                    <h3>{item.name}</h3>
                    <p>{item.time}</p>
                    <p>{item.address}</p>
                    {item.map_url && (
                      <a href={item.map_url} target="_blank" rel="noreferrer" className="inv-map-btn">
                        See Location
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {program?.length > 0 && (
        <section className="inv-section inv-timeline-section" id="program">
          <p className="inv-script-title">Timeline</p>
          <div className="inv-program-list">
            {program.map((item, index) => (
              <div key={index} className="inv-program-item">
                <strong>{item.time}</strong>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
