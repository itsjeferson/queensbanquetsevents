import StatCard from '../../common/Cards/StatCard';

export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
