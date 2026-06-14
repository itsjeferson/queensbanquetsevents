import Button from '../../components/common/Button/Button';
import DataTable from '../../components/common/Table/DataTable';
import { useBookings } from '../../hooks/useBookings';

const bookings = [
  { id: '#VE-2024-001', event: 'Wedding', date: 'Dec 28, 2024', package: 'Signature', guests: 120, status: 'Confirmed' },
  { id: '#VE-2024-002', event: 'Post-Wedding', date: 'Jan 5, 2025', package: 'Essential', guests: 50, status: 'Pending' },
  { id: '#VE-2023-018', event: 'Engagement', date: 'Nov 15, 2024', package: 'Essential', guests: 40, status: 'Completed' },
];

export default function MyBookings() {
  const { openBookingModal } = useBookings();
  const statusBadge = { Confirmed: 'badge-gold', Pending: 'badge-blue', Completed: 'badge-green' };

  return (
    <>
      <div className="dash-header">
        <h1>My Bookings</h1>
        <p>Manage and track all your event bookings.</p>
      </div>
      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        <Button variant="gold" onClick={() => openBookingModal()}>+ New Booking</Button>
      </div>
      <div className="card-widget">
        <DataTable
          columns={[
            { key: 'id', label: 'Booking ID' },
            { key: 'event', label: 'Event Type' },
            { key: 'date', label: 'Date' },
            { key: 'package', label: 'Package' },
            { key: 'guests', label: 'Guests' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: 'Action' },
          ]}
          data={bookings}
          renderCell={(key, row) => {
            if (key === 'status') return <span className={`badge ${statusBadge[row.status]}`}>{row.status}</span>;
            if (key === 'action') return <button type="button" className="action-btn">View</button>;
            return row[key];
          }}
        />
      </div>
    </>
  );
}
