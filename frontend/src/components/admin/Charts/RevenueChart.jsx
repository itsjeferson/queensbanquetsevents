export default function RevenueChart({ items, title = 'Monthly Revenue' }) {
  return (
    <div className="card-widget">
      <h3>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: 600 }}>{item.value}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
