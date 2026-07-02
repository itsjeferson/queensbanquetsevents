import { useEffect, useRef, useState } from 'react';
import Button from '../../components/common/Button/Button';
import DataTable from '../../components/common/Table/DataTable';
import Modal from '../../components/common/Modal/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import Loader from '../../components/common/Loader/Loader';
import Toast from '../../components/common/Toast/Toast';
import { clientService } from '../../services/clientService';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  status: 'active',
};

function statusLabel(status) {
  return status === 'active' ? 'Active' : 'Archived';
}

function statusBadgeClass(status) {
  return status === 'active' ? 'badge-green' : 'badge-gray';
}

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [error, setError] = useState('');
  const [confirmAddOpen, setConfirmAddOpen] = useState(false);
  const [confirmArchiveId, setConfirmArchiveId] = useState(null);
  const [creatingClient, setCreatingClient] = useState(false);
  const [archivingClient, setArchivingClient] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(''), 3200);
  };

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const loadClients = () => {
    setLoading(true);
    clientService.getAll()
      .then((res) => {
        setClients(res.data || []);
        setError('');
      })
      .catch(() => {
        setClients([]);
        setError('Could not load clients from the database.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openEdit = (client) => {
    setEditingId(client.id);
    setForm({
      firstName: client.first_name,
      lastName: client.last_name,
      email: client.email,
      phone: client.phone || '',
      password: '',
      confirmPassword: '',
      status: client.status === 'disabled' ? 'disabled' : 'active',
    });
    setError('');
    setEditOpen(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setConfirmAddOpen(true);
  };

  const confirmCreateClient = async () => {
    setCreatingClient(true);
    try {
      await clientService.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setCreatedCredentials({ email: form.email, password: form.password });
      setConfirmAddOpen(false);
      setAddOpen(false);
      setCredentialsOpen(true);
      setForm(emptyForm);
      loadClients();
      showToast('Client account created successfully.');
    } catch {
      setConfirmAddOpen(false);
      setError('Could not create client. Email may already be in use.');
    } finally {
      setCreatingClient(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      status: form.status,
    };
    if (form.password) payload.password = form.password;

    try {
      await clientService.update(editingId, payload);
      setEditOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      loadClients();
    } catch {
      setError('Could not update client.');
    }
  };

  const confirmArchiveClient = async () => {
    const id = confirmArchiveId;
    setArchivingClient(true);
    try {
      await clientService.archive(id);
      setConfirmArchiveId(null);
      loadClients();
      showToast('Client account archived.');
    } catch {
      setConfirmArchiveId(null);
      setError('Could not archive client.');
    } finally {
      setArchivingClient(false);
    }
  };

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Client Management</h1>
          <p>Create client accounts and manage access to the client portal.</p>
        </div>
        <Button variant="gold" onClick={() => { setForm(emptyForm); setError(''); setAddOpen(true); }}>
          + Add Client
        </Button>
      </div>

      <div className="card-widget">
        <h3>List of Clients</h3>
        {loading ? (
          <Loader variant="inline" label="Loading clients..." />
        ) : clients.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No clients found in the database yet.</p>
        ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={clients}
          renderCell={(key, row) => {
            if (key === 'name') return <strong>{row.first_name} {row.last_name}</strong>;
            if (key === 'status') return <span className={`badge ${statusBadgeClass(row.status)}`}>{statusLabel(row.status)}</span>;
            if (key === 'actions') return (
              <span>
                <button type="button" className="action-btn" onClick={() => openEdit(row)}>Update</button>
                {row.status === 'active' && (
                  <button type="button" className="action-btn danger" onClick={() => setConfirmArchiveId(row.id)}>Archive</button>
                )}
              </span>
            );
            return row[key] || '—';
          }}
        />
        )}
      </div>

      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Client"
        subtitle="Create login credentials for a new client account."
      >
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@email.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+63 917 000 0000" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" required minLength={6} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          {error && <p style={{ color: '#DC3545', fontSize: 13, marginBottom: 16 }}>{error}</p>}
          <Button variant="gold" style={{ width: '100%', padding: 14 }} type="submit">Create Client Account</Button>
        </form>
      </Modal>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Update Client"
        subtitle="Edit client information and account status."
      >
        <form onSubmit={handleUpdate}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="disabled">Archived</option>
            </select>
          </div>
          <div className="form-group">
            <label>New Password (optional)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          {error && <p style={{ color: '#DC3545', fontSize: 13, marginBottom: 16 }}>{error}</p>}
          <Button variant="gold" style={{ width: '100%', padding: 14 }} type="submit">Save Changes</Button>
        </form>
      </Modal>

      <Modal
        isOpen={credentialsOpen}
        onClose={() => setCredentialsOpen(false)}
        title="Client Credentials"
        subtitle="Share these login details with the client. They can use them to access the client portal."
      >
        {createdCredentials && (
          <div style={{ background: 'var(--beige)', borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 13, marginBottom: 8 }}><strong>Email:</strong> {createdCredentials.email}</p>
            <p style={{ fontSize: 13 }}><strong>Password:</strong> {createdCredentials.password}</p>
          </div>
        )}
        <Button variant="gold" style={{ width: '100%', padding: 14 }} onClick={() => setCredentialsOpen(false)}>Done</Button>
      </Modal>

      <ConfirmDialog
        isOpen={confirmAddOpen}
        title="Create Client Account"
        message={`Create a new client account for ${form.firstName} ${form.lastName} (${form.email})?`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        loadingLabel="Creating..."
        loading={creatingClient}
        onConfirm={confirmCreateClient}
        onCancel={() => setConfirmAddOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmArchiveId !== null}
        title="Archive Client"
        message="Archive this client? They will no longer be able to sign in."
        confirmLabel="Archive"
        cancelLabel="Cancel"
        tone="danger"
        loadingLabel="Archiving..."
        loading={archivingClient}
        onConfirm={confirmArchiveClient}
        onCancel={() => setConfirmArchiveId(null)}
      />

      <Toast show={!!toastMessage} message={toastMessage} />
    </>
  );
}
