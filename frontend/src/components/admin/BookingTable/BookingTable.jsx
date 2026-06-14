import DataTable from '../../common/Table/DataTable';

export default function BookingTable({ bookings, showActions = true }) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'client', label: 'Client' },
    { key: 'event', label: 'Event' },
    { key: 'date', label: 'Date' },
    { key: 'package', label: 'Package' },
    { key: 'guests', label: 'Guests' },
    { key: 'status', label: 'Status' },
    ...(showActions ? [{ key: 'actions', label: 'Actions' }] : []),
  ];

  const statusBadge = {
    Confirmed: 'badge-gold',
    Pending: 'badge-blue',
    Completed: 'badge-green',
    Cancelled: 'badge-red',
  };

  const renderCell = (key, row) => {
    if (key === 'status') {
      return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
    }
    if (key === 'actions') {
      return (
        <>
          <button type="button" className="action-btn">{row.status === 'Pending' ? 'Confirm' : 'Edit'}</button>
          {row.status !== 'Cancelled' && row.status !== 'Completed' && (
            <button type="button" className="action-btn danger">{row.status === 'Pending' ? 'Reject' : 'Cancel'}</button>
          )}
          {(row.status === 'Cancelled' || row.status === 'Completed') && (
            <button type="button" className="action-btn">View</button>
          )}
        </>
      );
    }
    return row[key];
  };

  return (
    <div className="card-widget">
      <DataTable columns={columns} data={bookings} renderCell={renderCell} />
    </div>
  );
}
