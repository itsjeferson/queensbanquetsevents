import { useEffect, useState } from 'react';
import DataTable from '../../components/common/Table/DataTable';
import { templateService } from '../../services/invitationService';

const demoTemplates = [
  { id: 1, template_name: 'Classic Gold', category: 'wedding', status: 'active' },
  { id: 2, template_name: 'Modern Minimalist', category: 'wedding', status: 'active' },
  { id: 3, template_name: 'Royal Luxury', category: 'wedding', status: 'active' },
  { id: 4, template_name: 'Pink Rose', category: 'debut', status: 'active' },
  { id: 5, template_name: 'Kids Theme', category: 'birthday', status: 'active' },
];

const CATEGORIES = ['wedding', 'debut', 'birthday', 'anniversary', 'corporate'];

export default function InvitationTemplates() {
  const [templates, setTemplates] = useState(demoTemplates);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ template_name: '', category: 'wedding' });

  useEffect(() => {
    templateService.getAll().then((res) => {
      if (res.data?.length) setTemplates(res.data);
    }).catch(() => {});
  }, []);

  const filtered = filter ? templates.filter((t) => t.category === filter) : templates;

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await templateService.create(form);
      setTemplates([...templates, res.data]);
    } catch {
      setTemplates([...templates, { id: Date.now(), ...form, status: 'active' }]);
    }
    setForm({ template_name: '', category: 'wedding' });
  };

  return (
    <>
      <div className="dash-header">
        <h1>Invitation Templates</h1>
        <p>Manage design templates for client invitations.</p>
      </div>

      <div className="dash-grid">
        <div className="card-widget">
          <h3>Add Template</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Template Name</label>
              <input required value={form.template_name} onChange={(e) => setForm({ ...form, template_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-gold">Add Template</button>
          </form>
        </div>

        <div className="card-widget">
          <h3>Filter by Category</h3>
          <div className="gallery-filter" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className={`filter-btn ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-widget">
        <div className="template-grid">
          {filtered.map((t) => (
            <div key={t.id} className="template-card">
              <div className="template-preview">✦</div>
              <h4>{t.template_name}</h4>
              <span className="badge badge-gold">{t.category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-widget">
        <h3>All Templates</h3>
        <DataTable
          columns={[
            { key: 'template_name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'status', label: 'Status' },
          ]}
          data={filtered}
          renderCell={(key, row) => {
            if (key === 'category') return <span className="badge badge-gold">{row.category}</span>;
            if (key === 'status') return <span className={`badge ${row.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{row.status}</span>;
            return row[key];
          }}
        />
      </div>
    </>
  );
}
