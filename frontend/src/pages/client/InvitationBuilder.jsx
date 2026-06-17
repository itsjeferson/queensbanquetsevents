import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, templateService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import {
  buildInvitationPreviewData,
  saveClientPreviewSlug,
  saveInvitationDraft,
} from '../../utils/invitationPreview';
import '../../styles/invitation.css';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'debut', label: 'Debut', icon: '👑' },
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'corporate', label: 'Corporate', icon: '🏢' },
];

const STEPS = ['Event Info', 'Choose Theme', 'Content', 'Publish'];

function slugFromEventName(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const defaultInvitation = {
  opening_line: '',
  hero_caption: '',
  quote: '',
  cover_image: '',
  background_video: '',
  music_url: '',
  gallery: [{ caption: '', image: '' }],
  story: { title: 'Our Story', sections: [{ heading: '', content: '' }] },
  venue: {
    ceremony: { name: '', address: '', time: '', map_url: '' },
    reception: { name: '', address: '', time: '', map_url: '' },
  },
  dress_code: '',
  attire: { guests: '' },
  gift_registry: { preferences: '' },
  coordinator: '',
  program: [{ time: '', title: '' }],
};

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
    invitation: { ...defaultInvitation },
  });

  const updateInvitation = (patch) => {
    setForm((current) => ({
      ...current,
      invitation: { ...current.invitation, ...patch },
    }));
  };

  const updateVenue = (type, field, value) => {
    setForm((current) => ({
      ...current,
      invitation: {
        ...current.invitation,
        venue: {
          ...current.invitation.venue,
          [type]: { ...(current.invitation.venue?.[type] || {}), [field]: value },
        },
      },
    }));
  };

  const updateStorySection = (index, field, value) => {
    setForm((current) => {
      const sections = [...(current.invitation.story?.sections || [])];
      sections[index] = { ...(sections[index] || {}), [field]: value };
      return {
        ...current,
        invitation: {
          ...current.invitation,
          story: { ...(current.invitation.story || {}), sections },
        },
      };
    });
  };

  const updateGallery = (index, patch) => {
    setForm((current) => {
      const gallery = [...(current.invitation.gallery || [])];
      gallery[index] = { ...(gallery[index] || {}), ...patch };
      return { ...current, invitation: { ...current.invitation, gallery } };
    });
  };

  const handleFile = async (file, onValue) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    onValue(dataUrl);
  };

  const gallery = form.invitation.gallery?.length ? form.invitation.gallery : [{ caption: '', image: '' }];
  const firstStory = form.invitation.story?.sections?.[0] || {};

  useEffect(() => {
    templateService.getAll(form.event_type).then((res) => {
      if (res.data?.length) setTemplates(res.data);
    }).catch(() => {});
  }, [form.event_type]);

  const filteredTemplates = templates.filter((t) => t.category === form.event_type);
  const hasEventName = form.event_name.trim().length > 0;
  const hasEventDate = Boolean(form.event_date);

  const persistInvitationPreview = (eventId, slug) => {
    const previewData = buildInvitationPreviewData({
      event: {
        id: eventId,
        event_name: form.event_name,
        event_type: form.event_type,
        event_date: form.event_date,
        slug,
        status: 'draft',
      },
      invitation: { template_id: form.template_id, ...form.invitation },
    });

    saveInvitationDraft(previewData);
    saveClientPreviewSlug(user?.id, slug);
  };

  const handleCreate = async () => {
    const slug = form.slug || slugFromEventName(form.event_name);
    const eventPayload = {
      client_id: user?.id || 1,
      event_name: form.event_name,
      event_type: form.event_type,
      event_date: form.event_date,
      slug,
      invitation: { template_id: form.template_id, ...form.invitation },
    };

    let eventId = 1;

    try {
      const res = await eventService.create(eventPayload);
      eventId = res.data?.id || 1;
      persistInvitationPreview(eventId, slug);
      navigate(`/client/invitation-manage/${eventId}`);
    } catch {
      persistInvitationPreview(eventId, slug);
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

      {step !== 2 ? (
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
                <input
                  value={form.event_name}
                  onChange={(e) => {
                    const event_name = e.target.value;
                    setForm({ ...form, event_name, slug: slugFromEventName(event_name) });
                  }}
                  placeholder="John & Jane"
                />
              </div>
              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Custom URL Slug</label>
              <input value={form.slug} readOnly placeholder="john&jane" />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Auto-generated from event name. Your invitation will be at: queensbanquet.com/#/invite/{form.slug || 'your-slug'}
              </p>
            </div>
            {!hasEventName && (
              <p style={{ fontSize: 13, color: '#DC3545', marginBottom: 12 }}>
                Enter an event name to continue.
              </p>
            )}
            <button type="button" className="btn btn-gold" onClick={() => setStep(1)} disabled={!hasEventName}>
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

        {step === 3 && (
          <>
            <h3>Ready to Publish</h3>
            <div style={{ marginTop: 20, padding: 24, background: 'var(--beige)', borderRadius: 12 }}>
              <p><strong>Event:</strong> {form.event_name}</p>
              <p><strong>Type:</strong> {form.event_type}</p>
              <p><strong>Date:</strong> {form.event_date ? new Date(`${form.event_date}T12:00:00`).toLocaleDateString() : '—'}</p>
              <p><strong>URL:</strong> /#/invite/{form.slug || slugFromEventName(form.event_name)}</p>
            </div>
            {!hasEventDate && (
              <p style={{ fontSize: 13, color: '#DC3545', marginTop: 12 }}>
                Go back to Event Info and select an event date before publishing.
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn btn-gold" onClick={handlePublish} disabled={!hasEventDate}>Save & Publish</button>
            </div>
          </>
        )}
      </div>
      ) : (
        <>
          <div className="card-widget">
            <h3>Invitation Details</h3>
            <div className="form-row" style={{ marginTop: 20 }}>
              <div className="form-group">
                <label>Opening Line</label>
                <input value={form.invitation.opening_line || ''} onChange={(e) => updateInvitation({ opening_line: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Hero Caption</label>
                <input value={form.invitation.hero_caption || ''} onChange={(e) => updateInvitation({ hero_caption: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Quote</label>
              <textarea value={form.invitation.quote || ''} onChange={(e) => updateInvitation({ quote: e.target.value })} />
            </div>
          </div>

          <div className="dash-grid">
            <div className="card-widget">
              <h3>Photos, Music & Video</h3>
              <div className="form-group" style={{ marginTop: 20 }}>
                <label>Cover Photo URL</label>
                <input value={form.invitation.cover_image || ''} onChange={(e) => updateInvitation({ cover_image: e.target.value })} placeholder="https://..." />
                <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateInvitation({ cover_image: value }))} />
              </div>
              <div className="form-group">
                <label>Background Video URL</label>
                <input value={form.invitation.background_video || ''} onChange={(e) => updateInvitation({ background_video: e.target.value })} placeholder="https://...mp4" />
                <input type="file" accept="video/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateInvitation({ background_video: value }))} />
              </div>
              <div className="form-group">
                <label>Music URL</label>
                <input value={form.invitation.music_url || ''} onChange={(e) => updateInvitation({ music_url: e.target.value })} placeholder="https://...mp3" />
                <input type="file" accept="audio/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateInvitation({ music_url: value }))} />
              </div>
            </div>

            <div className="card-widget">
              <h3>Gallery Photos</h3>
              {gallery.slice(0, 4).map((item, index) => (
                <div key={index} className="form-group" style={{ marginTop: index === 0 ? 20 : 0 }}>
                  <label>Photo {index + 1}</label>
                  <input value={item.caption || ''} onChange={(e) => updateGallery(index, { caption: e.target.value })} placeholder="Caption" />
                  <input value={item.image || ''} onChange={(e) => updateGallery(index, { image: e.target.value })} placeholder="Image URL" />
                  <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateGallery(index, { image: value }))} />
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={() => updateInvitation({ gallery: [...gallery, { caption: '', image: '' }] })}>Add Photo Slot</button>
            </div>
          </div>

          <div className="card-widget">
            <h3>Story & Invitation Message</h3>
            <div className="form-row" style={{ marginTop: 20 }}>
              <div className="form-group">
                <label>Story Title</label>
                <input value={form.invitation.story?.title || ''} onChange={(e) => updateInvitation({ story: { ...(form.invitation.story || {}), title: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Story Heading</label>
                <input value={firstStory.heading || ''} onChange={(e) => updateStorySection(0, 'heading', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Story Text</label>
              <textarea value={firstStory.content || ''} onChange={(e) => updateStorySection(0, 'content', e.target.value)} />
            </div>
          </div>

          <div className="dash-grid">
            <div className="card-widget">
              <h3>Venue & Schedule</h3>
              {['ceremony', 'reception'].map((type) => (
                <div key={type} style={{ marginBottom: 20, marginTop: type === 'ceremony' ? 20 : 0 }}>
                  <h4 style={{ textTransform: 'capitalize', marginBottom: 12 }}>{type}</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input value={form.invitation.venue?.[type]?.name || ''} onChange={(e) => updateVenue(type, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input value={form.invitation.venue?.[type]?.time || ''} onChange={(e) => updateVenue(type, 'time', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input value={form.invitation.venue?.[type]?.address || ''} onChange={(e) => updateVenue(type, 'address', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Map URL</label>
                    <input value={form.invitation.venue?.[type]?.map_url || ''} onChange={(e) => updateVenue(type, 'map_url', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card-widget">
              <h3>Attire, Gifts & FAQs</h3>
              <div className="form-group" style={{ marginTop: 20 }}>
                <label>Dress Code</label>
                <input value={form.invitation.dress_code || ''} onChange={(e) => updateInvitation({ dress_code: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Guest Attire Notes</label>
                <textarea value={form.invitation.attire?.guests || ''} onChange={(e) => updateInvitation({ attire: { ...(form.invitation.attire || {}), guests: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Gift Note</label>
                <textarea value={form.invitation.gift_registry?.preferences || ''} onChange={(e) => updateInvitation({ gift_registry: { ...(form.invitation.gift_registry || {}), preferences: e.target.value } })} />
              </div>
              <div className="form-group">
                <label>Coordinator</label>
                <input value={form.invitation.coordinator || ''} onChange={(e) => updateInvitation({ coordinator: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card-widget">
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn btn-gold" onClick={() => setStep(3)}>Next: Publish</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
