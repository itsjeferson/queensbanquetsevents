export default function StatCard({ label, value, trend, trendClass = '' }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {trend && <div className={`trend ${trendClass}`}>{trend}</div>}
    </div>
  );
}
