import { useEffect, useState } from 'react';
import { templateService } from '../../services/invitationService';
import InvitationPreviewModal from './InvitationPreviewModal';
import { defaultWeddingInvitationContent, normalizeInvitationContent } from '../../utils/invitationContent';

export default function InvitationTemplateSelector({
  selectedId,
  onSelect,
  category = 'wedding',
  currentForm = {}
}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    setLoading(true);
    templateService.getAll(category)
      .then((res) => {
        // Fallback to defaults if empty
        const list = res.data || [];
        setTemplates(list.filter(t => t.status === 'active'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const getPreviewData = () => {
    if (!previewTemplate) return null;
    const config = previewTemplate.theme_config || {};
    const primary = config.primary || '#D4AF37';
    const accent = config.accent || '#F4EEE7';
    const font = config.font || 'Playfair Display';

    return {
      event: {
        event_name: currentForm.event_name || 'Mark & She',
        event_type: 'wedding',
        event_date: currentForm.event_date || new Date().toISOString(),
        slug: currentForm.slug || 'preview-slug',
      },
      invitation: {
        ...normalizeInvitationContent(currentForm.invitation || defaultWeddingInvitationContent),
        primary_color: primary,
        secondary_color: accent,
        font_family: font,
        color_motif: 'custom',
        palette_colors: [primary, '#FFFAF5', accent, primary, primary, primary],
        template_id: previewTemplate.id
      }
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading design templates...
      </div>
    );
  }

  return (
    <div className="template-picker-section" style={{ marginTop: 24 }}>
      <label className="inv-settings-field-label">Choose Design Template *</label>
      <p className="form-help" style={{ marginBottom: 16 }}>
        Select a starting design theme. You can preview how it looks with your event details before choosing.
      </p>

      <div className="template-picker-grid">
        {templates.map((t) => {
          const isSelected = Number(selectedId) === Number(t.id);
          const config = t.theme_config || {};
          return (
            <div key={t.id} className={`template-picker-card ${isSelected ? 'selected' : ''}`}>
              <div className="template-picker-preview" style={{ background: config.accent || 'var(--gold-pale)' }}>
                <span className="template-picker-letter" style={{ color: config.primary || 'var(--gold-dark)', fontFamily: config.font || 'Playfair Display' }}>
                  A
                </span>
                <div className="template-picker-dots">
                  <span style={{ background: config.primary }} />
                  <span style={{ background: config.accent }} />
                </div>
              </div>
              <div className="template-picker-body">
                <h4>{t.template_name}</h4>
                <p className="template-picker-meta">{config.font || 'Playfair Display'}</p>
                <div className="template-picker-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-gold' : 'btn-outline'}`}
                    onClick={() => onSelect(t)}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-white"
                    onClick={() => handlePreview(t)}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewTemplate && (
        <InvitationPreviewModal
          open={Boolean(previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          data={getPreviewData()}
          title={`Template Preview: ${previewTemplate.template_name}`}
        />
      )}
    </div>
  );
}
