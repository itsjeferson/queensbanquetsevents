export default function TimelineSection({ program }) {
  if (!program?.length) return null;

  return (
    <section className="inv-section inv-timeline-section" id="program">
      <p className="inv-script-title inv-script-title-small">Timeline</p>
      <div className="inv-divider" />
      <div className="inv-program-list">
        {program.map((item, index) => (
          <div key={`${item.time}-${item.title}-${index}`} className="inv-program-item">
            <strong>{item.time}</strong>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
