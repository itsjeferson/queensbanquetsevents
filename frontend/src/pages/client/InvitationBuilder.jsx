import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, templateService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/invitation.css';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'debut', label: 'Debut', icon: '👑' },
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'corporate', label: 'Corporate', icon: '🏢' },
];

const STEPS = ['Event Info', 'Choose Theme', 'Content', 'Publish'];

const DEMO_TEMPLATES = [
  { id: 1, template_name: 'Classic Gold', category: 'wedding' },
  { id: 2, template_name: 'Modern Minimalist', category: 'wedding' },
  { id: 3, template_name: 'Pink Rose', category: 'debut' },
  { id: 4, template_name: 'Kids Theme', category: 'birthday' },
];

export default function InvitationBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [templates, setTemplates] = useState(DEMO_TEMPLATES);
  const [form, setForm] = useState({
    event_name: '',
    event_type: 'wedding',
    event_date: '',
    slug: '',
    template_id: null,
    invitation: {
      dress_code: '',
      story: { title: 'Our Story', sections: [{ heading: '', content: '' }] },
      venue: { ceremony: { name: '', address: '', time: '' }, reception: { name: '', address: '', time: '' } },
      program: [{ time: '', title: '' }],
    },
  });

  useEffect(() => {
    templateService.getAll(form.event_type).then((res) => {
      if (res.data?.length) setTemplates(res.data);
    }).catch(() => {});
  }, [form.event_type]);

  const filteredTemplates = templates.filter((t) => t.category === form.event_type);

  const handleCreate = async () => {
    try {
      const res = await eventService.create({
        client_id: user?.id || 1,
        event_name: form.event_name,
        event_type: form.event_type,
        event_date: form.event_date,
        slug: form.slug || form.event_name.toLowerCase().replace(/\s+/g, '-'),
        invitation: { template_id: form.template_id, ...form.invitation },
      });
      navigate(`/client/invitation-manage/${res.data.id}`);
    } catch {
      navigate('/client/invitation-manage/1');
    }
  };

  const handlePublish = async () => {
    await handleCreate();
  };

  return (
    <>
      <div className="dash-header">
        <h1>Invitation Builder</h1>
        <p>Create your personalized event website in minutes.</p>
      </div>

      <div className="inv-builder-steps">
        {STEPS.map((s, i) => (
          <span key={s} className={`inv-builder-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className="card-widget">
        {step === 0 && (
          <>
            <h3>Event Information</h3>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Event Type</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`template-card ${form.event_type === type.value ? 'selected' : ''}`}
                    style={{ minWidth: 100 }}
                    onClick={() => setForm({ ...form, event_type: type.value })}
                  >
                    <span style={{ fontSize: 24 }}>{type.icon}</span>
                    <h4>{type.label}</h4>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Event Name *</label>
                <input value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} placeholder="John & Jane" />
              </div>
              <div className="form-group">
                <label>Event Date *</label>
                <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Custom URL Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="john-jane" />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Your invitation will be at: queensbanquet.com/#/invite/{form.slug || 'your-slug'}
              </p>
            </div>
            <button type="button" className="btn btn-gold" onClick={() => setStep(1)} disabled={!form.event_name || !form.event_date}>
              Next: Choose Theme
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h3>Choose a Template</h3>
            <div className="template-grid" style={{ marginTop: 20 }}>
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  className={`template-card ${form.template_id === t.id ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, template_id: t.id })}
                >
                  <div className="template-preview">✦</div>
                  <h4>{t.template_name}</h4>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="btn btn-gold" onClick={() => setStep(2)}>Next: Add Content</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Invitation Content</h3>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Dress Code</label>
              <input value={form.invitation.dress_code} onChange={(e) => setForm({ ...form, invitation: { ...form.invitation, dress_code: e.target.value } })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ceremony Venue</label>
                <input value={form.invitation.venue.ceremony.name} onChange={(e) => setForm({ ...form, invitation: { ...form.invitation, venue: { ...form.invitation.venue, ceremony: { ...form.invitation.venue.ceremony, name: e.target.value } } } })} />
              </div>
              <div className="form-group">
                <label>Reception Venue</label>
                <input value={form.invitation.venue.reception.name} onChange={(e) => setForm({ ...form, invitation: { ...form.invitation, venue: { ...form.invitation.venue, reception: { ...form.invitation.venue.reception, name: e.target.value } } } })} />
              </div>
            </div>
            <div className="form-group">
              <label>Story Heading</label>
              <input value={form.invitation.story.sections[0]?.heading || ''} onChange={(e) => {
                const sections = [...form.invitation.story.sections];
                sections[0] = { ...sections[0], heading: e.target.value };
                setForm({ ...form, invitation: { ...form.invitation, story: { ...form.invitation.story, sections } } });
              }} />
            </div>
            <div className="form-group">
              <label>Story Content</label>
              <textarea value={form.invitation.story.sections[0]?.content || ''} onChange={(e) => {
                const sections = [...form.invitation.story.sections];
                sections[0] = { ...sections[0], content: e.target.value };
                setForm({ ...form, invitation: { ...form.invitation, story: { ...form.invitation.story, sections } } });
              }} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn btn-gold" onClick={() => setStep(3)}>Next: Publish</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Ready to Publish</h3>
            <div style={{ marginTop: 20, padding: 24, background: 'var(--beige)', borderRadius: 12 }}>
              <p><strong>Event:</strong> {form.event_name}</p>
              <p><strong>Type:</strong> {form.event_type}</p>
              <p><strong>Date:</strong> {form.event_date ? new Date(form.event_date).toLocaleString() : '—'}</p>
              <p><strong>URL:</strong> /#/invite/{form.slug || form.event_name.toLowerCase().replace(/\s+/g, '-')}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn btn-gold" onClick={handlePublish}>Save & Publish</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
