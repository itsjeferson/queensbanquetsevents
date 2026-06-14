import DataTable from '../../components/common/Table/DataTable';

const pending = [
  { client: 'Maria Santos', booking: '#VE-2024-001', amount: '₱23,750', submitted: 'Nov 20, 2024' },
  { client: 'John Lim', booking: '#VE-2024-002', amount: '₱92,500', submitted: 'Nov 21, 2024' },
  { client: 'Leo Ramos', booking: '#VE-2024-005', amount: '₱46,250', submitted: 'Nov 22, 2024' },
];

const verified = [
  { client: 'Maria Santos', booking: '#VE-2024-001', amount: '₱47,500', verified: 'Nov 1, 2024', status: 'Verified' },
  { client: 'Apex Corp.', booking: '#VE-2024-003', amount: '₱22,500', verified: 'Nov 5, 2024', status: 'Verified' },
];

export default function AdminPayments() {
  return (
    <>
      <div className="dash-header">
        <h1>Payment Verification</h1>
        <p>Review and approve client payment receipts.</p>
      </div>
      <div className="card-widget">
        <h3>Pending Verification (7)</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Client</th><th>Booking</th><th>Amount</th><th>Submitted</th><th>Receipt</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.booking}>
                  <td>{p.client}</td>
                  <td>{p.booking}</td>
                  <td>{p.amount}</td>
                  <td>{p.submitted}</td>
                  <td><button type="button" className="action-btn">View Receipt</button></td>
                  <td>
                    <button type="button" className="action-btn" style={{ color: '#1B7A35', borderColor: '#1B7A35' }}>✓ Approve</button>
                    <button type="button" className="action-btn danger">✗ Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-widget" style={{ marginTop: 20 }}>
        <h3>Verified Payments</h3>
        <DataTable
          columns={[
            { key: 'client', label: 'Client' },
            { key: 'booking', label: 'Booking' },
            { key: 'amount', label: 'Amount' },
            { key: 'verified', label: 'Verified On' },
            { key: 'status', label: 'Status' },
          ]}
          data={verified}
          renderCell={(key, row) => {
            if (key === 'status') return <span className="badge badge-green">{row.status}</span>;
            return row[key];
          }}
        />
      </div>
    </>
  );
}
