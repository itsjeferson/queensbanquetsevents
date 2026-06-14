import PaymentForm from '../../components/client/PaymentForm/PaymentForm';
import DataTable from '../../components/common/Table/DataTable';

const payments = [
  { date: 'Nov 1, 2024', description: 'Downpayment — Signature', amount: '₱47,500', status: 'Verified' },
  { date: 'Nov 20, 2024', description: '2nd Payment', amount: '₱23,750', status: 'Pending' },
  { date: '—', description: 'Final Payment', amount: '₱23,750', status: 'Due Dec 15' },
];

const bookings = [
  { id: '#VE-2024-001', event: 'Wedding' },
  { id: '#VE-2024-002', event: 'Post-Wedding' },
];

export default function Payments() {
  const statusBadge = { Verified: 'badge-green', Pending: 'badge-gold', 'Due Dec 15': 'badge-gray' };

  return (
    <>
      <div className="dash-header">
        <h1>Payments</h1>
        <p>View payment history and upload proof of payment.</p>
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <h3>Payment History</h3>
          <DataTable
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'description', label: 'Description' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
            ]}
            data={payments}
            renderCell={(key, row) => {
              if (key === 'status') return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
              return row[key];
            }}
          />
        </div>
        <PaymentForm bookings={bookings} />
      </div>
    </>
  );
}
