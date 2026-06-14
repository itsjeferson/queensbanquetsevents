import BookingTable from '../../components/admin/BookingTable/BookingTable';
import Button from '../../components/common/Button/Button';

const bookings = [
  { id: '001', client: 'Maria Santos', event: 'Wedding', date: 'Dec 28', package: 'Signature', guests: 120, status: 'Confirmed' },
  { id: '002', client: 'John Lim', event: 'Debut', date: 'Jan 3', package: 'Grand', guests: 200, status: 'Pending' },
  { id: '003', client: 'Apex Corp.', event: 'Corporate', date: 'Jan 10', package: 'Essential', guests: 80, status: 'Confirmed' },
  { id: '004', client: 'Ana Garcia', event: 'Birthday', date: 'Jan 15', package: 'Signature', guests: 100, status: 'Cancelled' },
  { id: '005', client: 'Leo Ramos', event: 'Wedding', date: 'Feb 2', package: 'Grand', guests: 250, status: 'Pending' },
];

export default function AdminBookings() {
  return (
    <>
      <div className="dash-header">
        <h1>Manage Bookings</h1>
        <p>View, confirm, and manage all event bookings.</p>
      </div>
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="Search by client name, event type, booking ID..." />
        <select style={{ padding: '11px 16px', border: '1.5px solid var(--border-soft)', borderRadius: 8, fontFamily: 'Poppins, sans-serif', fontSize: 14 }}>
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
        <Button variant="gold">+ New Booking</Button>
      </div>
      <BookingTable bookings={bookings} />
    </>
  );
}
