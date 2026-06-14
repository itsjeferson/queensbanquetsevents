import DashboardStats from '../DashboardStats/DashboardStats';
import RevenueChart from '../Charts/RevenueChart';

const reportStats = [
  { label: 'YTD Revenue', value: '₱8.4M', trend: '↑ 22% vs last year', trendClass: 'trend-up' },
  { label: 'Total Events', value: '89', trend: '↑ 15% vs last year', trendClass: 'trend-up' },
  { label: 'Avg. Package Value', value: '₱94k', trend: 'Signature most popular' },
  { label: 'Client Retention', value: '68%', trend: '↑ repeat clients', trendClass: 'trend-up' },
];

const revenueByPackage = [
  { label: 'Grand', value: '₱3,700,000 (44%)', percent: 44 },
  { label: 'Signature', value: '₱2,850,000 (34%)', percent: 34 },
  { label: 'Essential', value: '₱1,850,000 (22%)', percent: 22 },
];

export default function Reports() {
  return (
    <>
      <DashboardStats stats={reportStats} />
      <RevenueChart items={revenueByPackage} title="Revenue by Package Type" />
    </>
  );
}
