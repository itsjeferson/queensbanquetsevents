import UserManager from '../../components/admin/UserManager/UserManager';

const clients = [
  { name: 'Maria Santos', email: 'maria@email.com', phone: '+63 917 123 4567', bookings: 3, status: 'Active' },
  { name: 'John Lim', email: 'john@email.com', phone: '+63 918 234 5678', bookings: 1, status: 'Active' },
  { name: 'Apex Corporation', email: 'events@apex.ph', phone: '+63 2 8888 0000', bookings: 2, status: 'Active' },
  { name: 'Ana Garcia', email: 'ana@email.com', phone: '+63 919 345 6789', bookings: 1, status: 'Disabled' },
];

export default function Clients() {
  return (
    <>
      <div className="dash-header">
        <h1>Client Management</h1>
        <p>View and manage all client accounts.</p>
      </div>
      <UserManager clients={clients} />
    </>
  );
}
