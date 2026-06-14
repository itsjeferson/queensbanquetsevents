import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from '../../components/common/Table/DataTable';
import { guestService } from '../../services/invitationService';

const demoGuests = [
  { id: 1, name: 'Maria Garcia', email: 'maria@email.com', phone: '09171234567', attendance: 'yes', guest_count: 2 },
  { id: 2, name: 'Pedro Reyes', email: 'pedro@email.com', phone: '09189876543', attendance: 'yes', guest_count: 1 },
  { id: 3, name: 'Ana Cruz', email: 'ana@email.com', phone: '09155551234', attendance: 'no', guest_count: 0 },
  { id: 4, name: 'James Lee', email: 'james@email.com', phone: '09173334444', attendance: null, guest_count: null },
];

export default function GuestManagement() {
  const { id } = useParams();
  const [guests, setGuests] = useState(demoGuests);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
  const [bulkText, setBulkText] = useState('');

  useEffect(() => {
    guestService.getByEvent(id).then((res) => {
      if (res.data?.length) setGuests(res.data);
    }).catch(() => {});
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await guestService.add({ event_id: Number(id), ...newGuest });
      setGuests([...guests, res.data]);
    } catch {
      setGuests([...guests, { id: Date.now(), ...newGuest, attendance: null }]);
    }
    setNewGuest({ name: '', email: '', phone: '' });
  };

  const handleBulkImport = async () => {
    const lines = bulkText.split('\n').filter(Boolean);
    const imported = lines.map((line) => {
      const [name, email, phone] = line.split(',').map((s) => s.trim());
      return { name, email, phone };
    });
    try {
      await guestService.bulkAdd(Number(id), imported);
    } catch { /* demo fallback */ }
    setGuests([...guests, ...imported.map((g, i) => ({ id: Date.now() + i, ...g, attendance: null }))]);
    setBulkText('');
  };

  const handleRemove = async (guestId) => {
    try { await guestService.remove(guestId); } catch { /* demo */ }
    setGuests(guests.filter((g) => g.id !== guestId));
  };

  return (
    <>
      <div className="dash-header">
        <h1>Guest Management</h1>
        <p>Add, import, and track your event guests.</p>
      </div>

      <div className="dash-grid">
        <div className="card-widget">
          <h3>Add Guest</h3>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input required value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={newGuest.email} onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-gold">Add Guest</button>
          </form>
        </div>

        <div className="card-widget">
          <h3>Bulk Import</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>One guest per line: Name, Email, Phone</p>
          <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder="Maria Garcia, maria@email.com, 09171234567" style={{ minHeight: 100 }} />
          <button type="button" className="btn btn-outline" style={{ marginTop: 12 }} onClick={handleBulkImport} disabled={!bulkText.trim()}>
            Import Guests
          </button>
        </div>
      </div>

      <div className="card-widget">
        <h3>Guest List ({guests.length})</h3>
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'attendance', label: 'RSVP' },
            { key: 'actions', label: '' },
          ]}
          data={guests}
          renderCell={(key, row) => {
            if (key === 'attendance') {
              if (!row.attendance) return <span className="badge badge-gray">Pending</span>;
              return <span className={`badge ${row.attendance === 'yes' ? 'badge-green' : 'badge-red'}`}>{row.attendance}</span>;
            }
            if (key === 'actions') return (
              <button type="button" className="action-btn danger" onClick={() => handleRemove(row.id)}>Remove</button>
            );
            return row[key] || '—';
          }}
        />
      </div>
    </>
  );
}
