export default function EventTimeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={item.title} className="timeline-item">
          <div
            className="timeline-dot"
            style={i > 0 ? { background: 'var(--beige-dark)', boxShadow: '0 0 0 2px var(--beige-dark)' } : undefined}
          />
          <strong>{item.title}</strong>
          <span>{item.date}</span>
        </div>
      ))}
    </div>
  );
}
