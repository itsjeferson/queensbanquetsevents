export default function UserManager({ clients }) {
  return (
    <>
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="Search clients..." />
        <button type="button" className="btn btn-gold">Export List</button>
      </div>
      <div className="card-widget">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.email}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.bookings}</td>
                  <td>
                    <span className={`badge ${c.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{c.status}</span>
                  </td>
                  <td>
                    <button type="button" className="action-btn">View</button>
                    <button type="button" className={`action-btn${c.status === 'Active' ? ' danger' : ''}`}>
                      {c.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
