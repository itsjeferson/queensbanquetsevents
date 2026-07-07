import { useEffect, useState } from 'react';
import DataTable from '../../components/common/Table/DataTable';
import { templateService } from '../../services/invitationService';
import InvitationPreviewModal from '../../components/invitation/InvitationPreviewModal';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/common/Toast/Toast';

const CATEGORIES = ['wedding', 'debut', 'birthday', 'anniversary', 'corporate'];
const FONTS = ['Playfair Display', 'Poppins', 'Inter', 'Lora', 'Great Vibes', 'Montserrat'];

export default function InvitationTemplates() {
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Form state
  const [form, setForm] = useState({
    template_name: '',
    category: 'wedding',
    preview_image: '',
    primary_color: '#B47B36',
    accent_color: '#F4EEE7',
    font_family: 'Playfair Display'
  });

  // Edit Modal state
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editForm, setEditForm] = useState({
    template_name: '',
    category: 'wedding',
    preview_image: '',
    primary_color: '',
    accent_color: '',
    font_family: '',
    status: 'active'
  });

  // Preview Modal state
  const [previewData, setPreviewData] = useState(null);

  // Delete & Notification states
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadTemplates = () => {
    setLoading(true);
    templateService.getAll()
      .then((res) => {
        setTemplates(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const filtered = filter ? templates.filter((t) => t.category === filter) : templates;

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      template_name: form.template_name,
      category: form.category,
      preview_image: form.preview_image || '/images/templates/default.jpg',
      theme_config: {
        primary: form.primary_color,
        accent: form.accent_color,
        font: form.font_family
      },
      status: 'active'
    };

    try {
      await templateService.create(payload);
      loadTemplates();
      setForm({
        template_name: '',
        category: 'wedding',
        preview_image: '',
        primary_color: '#B47B36',
        accent_color: '#F4EEE7',
        font_family: 'Playfair Display'
      });
      showToast('Template created successfully.');
    } catch {
      showToast('Could not save template to server.');
    }
  };

  const handleEditClick = (template) => {
    const config = template.theme_config || {};
    setEditingTemplate(template);
    setEditForm({
      template_name: template.template_name,
      category: template.category,
      preview_image: template.preview_image || '',
      primary_color: config.primary || '#B47B36',
      accent_color: config.accent || '#F4EEE7',
      font_family: config.font || 'Playfair Display',
      status: template.status || 'active'
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;

    const payload = {
      template_name: editForm.template_name,
      category: editForm.category,
      preview_image: editForm.preview_image || '/images/templates/default.jpg',
      theme_config: {
        primary: editForm.primary_color,
        accent: editForm.accent_color,
        font: editForm.font_family
      },
      status: editForm.status
    };

    try {
      await templateService.update(editingTemplate.id, payload);
      setEditingTemplate(null);
      loadTemplates();
      showToast('Template updated successfully.');
    } catch {
      showToast('Could not update template.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await templateService.delete(deleteTargetId);
      showToast('Template deleted successfully.');
      loadTemplates();
    } catch {
      showToast('Could not delete template.');
    } finally {
      setDeleteLoading(false);
      setDeleteTargetId(null);
    }
  };

  const handlePreview = (template) => {
    const config = template.theme_config || {};
    const primary = config.primary || '#D4AF37';
    const accent = config.accent || '#F4EEE7';
    const font = config.font || 'Playfair Display';

    setPreviewData({
      event: {
        event_name: 'Preview Event',
        event_type: template.category,
        event_date: new Date().toISOString(),
        slug: 'preview',
      },
      invitation: {
        primary_color: primary,
        secondary_color: accent,
        font_family: font,
        color_motif: 'custom',
        palette_colors: [primary, '#FFFAF5', accent, primary, primary, primary],
        template_id: template.id
      }
    });
  };

  return (
    <>
      <div className="dash-header">
        <h1>Invitation Templates</h1>
        <p>Manage and customize template designs for clients.</p>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Side - Add Form */}
        <div className="card-widget">
          <h3>Add New Template</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Template Name</label>
              <input
                required
                value={form.template_name}
                onChange={(e) => setForm({ ...form, template_name: e.target.value })}
                placeholder="e.g. Sage Garden"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Preview Image URL</label>
              <input
                value={form.preview_image}
                onChange={(e) => setForm({ ...form, preview_image: e.target.value })}
                placeholder="/images/templates/wedding-sage.jpg"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Primary Color</label>
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  style={{ height: '44px', padding: '4px' }}
                />
              </div>
              <div className="form-group">
                <label>Accent Color</label>
                <input
                  type="color"
                  value={form.accent_color}
                  onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                  style={{ height: '44px', padding: '4px' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Font Family</label>
              <select value={form.font_family} onChange={(e) => setForm({ ...form, font_family: e.target.value })}>
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>Add Template</button>
          </form>
        </div>

        {/* Right Side - List & Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card-widget">
            <h3>Filter by Category</h3>
            <div className="gallery-filter" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
              <button type="button" className={`filter-btn ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="card-widget">
            <h3>Active Templates</h3>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading...</div>
            ) : (
              <div className="template-picker-grid">
                {filtered.map((t) => {
                  const config = t.theme_config || {};
                  return (
                    <div key={t.id} className="template-picker-card">
                      <div className="template-picker-preview" style={{ background: config.accent || 'var(--gold-pale)' }}>
                        <span className="template-picker-letter" style={{ color: config.primary || 'var(--gold-dark)', fontFamily: config.font || 'Playfair Display' }}>
                          A
                        </span>
                        <div className="template-picker-dots">
                          <span style={{ background: config.primary }} />
                          <span style={{ background: config.accent }} />
                        </div>
                        <button
                          type="button"
                          className="template-preview-hover-btn"
                          onClick={() => handlePreview(t)}
                        >
                          Preview Design
                        </button>
                      </div>
                      <div className="template-picker-body">
                        <h4>{t.template_name}</h4>
                        <p className="template-picker-meta">{t.category} • {config.font || 'Playfair Display'}</p>
                        <div className="template-picker-actions">
                          <button type="button" className="btn btn-sm btn-gold" onClick={() => handleEditClick(t)}>Edit</button>
                          <button type="button" className="btn btn-sm btn-outline" style={{ borderColor: '#DC3545', color: '#DC3545' }} onClick={() => handleDeleteClick(t.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="modal-overlay open" onClick={() => setEditingTemplate(null)} role="presentation">
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2>Edit Template</h2>
              <button type="button" className="modal-close" onClick={() => setEditingTemplate(null)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label>Template Name</label>
                <input
                  required
                  value={editForm.template_name}
                  onChange={(e) => setEditForm({ ...editForm, template_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Preview Image URL</label>
                <input
                  value={editForm.preview_image}
                  onChange={(e) => setEditForm({ ...editForm, preview_image: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Color</label>
                  <input
                    type="color"
                    value={editForm.primary_color}
                    onChange={(e) => setEditForm({ ...editForm, primary_color: e.target.value })}
                    style={{ height: '44px', padding: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label>Accent Color</label>
                  <input
                    type="color"
                    value={editForm.accent_color}
                    onChange={(e) => setEditForm({ ...editForm, accent_color: e.target.value })}
                    style={{ height: '44px', padding: '4px' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Font Family</label>
                <select value={editForm.font_family} onChange={(e) => setEditForm({ ...editForm, font_family: e.target.value })}>
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditingTemplate(null)}>Cancel</button>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewData && (
        <InvitationPreviewModal
          open={Boolean(previewData)}
          onClose={() => setPreviewData(null)}
          data={previewData}
        />
      )}

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Template"
        message="Are you sure you want to delete this template? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loadingLabel="Deleting..."
        tone="danger"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Toast Notification */}
      <Toast show={Boolean(toastMessage)} message={toastMessage} />
    </>
  );
}
