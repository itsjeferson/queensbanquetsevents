import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import {
  buildInvitationPreviewData,
  saveClientPreviewSlug,
  saveInvitationDraft,
} from '../../utils/invitationPreview';
import { slugFromEventName } from '../../utils/slug';
import MediaField from '../../components/common/MediaField/MediaField';
import { getMediaFieldDisplay, isDataUrl, readFileAsDataUrl, MAX_AUDIO_SIZE_MB, MAX_IMAGE_SIZE_MB, MAX_VIDEO_SIZE_MB } from '../../utils/mediaUpload';
import '../../styles/invitation.css';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'debut', label: 'Debut', icon: '👑' },
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'corporate', label: 'Corporate', icon: '🏢' },
];

const STEPS = ['Event Info', 'Content', 'Publish'];

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

export default function InvitationBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [fileError, setFileError] = useState('');
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

  const handleFile = async (file, onValue, maxSizeMb = MAX_IMAGE_SIZE_MB) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file, maxSizeMb);
      onValue(dataUrl);
      setFileError('');
    } catch (err) {
      setFileError(err.message || 'Could not upload file.');
    }
  };

  const gallery = form.invitation.gallery?.length ? form.invitation.gallery : [{ caption: '', image: '' }];
  const firstStory = form.invitation.story?.sections?.[0] || {};

  const hasEventName = form.event_name.trim().length > 0;
  const hasEventDate = Boolean(form.event_date);

  const persistInvitationPreview = (eventId, slug) => {
    const previewData = buildInvitationPreviewData({
      event: {
        id: eventId ?? undefined,
        event_name: form.event_name,
        event_type: form.event_type,
        event_date: form.event_date,
        slug,
        status: eventId ? 'published' : 'draft',
      },
      invitation: { template_id: form.template_id, ...form.invitation },
    });

    saveInvitationDraft(previewData);
    saveClientPreviewSlug(user?.id, slug);
  };

  const handlePublish = async () => {
    const slug = form.slug || slugFromEventName(form.event_name);
    const eventPayload = {
      client_id: user?.id,
      event_name: form.event_name,
      event_type: form.event_type,
      event_date: form.event_date,
      slug,
      invitation: { template_id: form.template_id, ...form.invitation },
    };

    setPublishing(true);
    setPublishError('');

    try {
      if (!user?.id) {
        throw new Error('You must be logged in to publish an invitation.');
      }

      const res = await eventService.create(eventPayload);
      const created = res.data;
      const eventId = created?.id;

      if (!eventId) {
        throw new Error('The server did not return an event ID. Please try again.');
      }

      persistInvitationPreview(eventId, slug);
      await eventService.publish(eventId);
      navigate(`/client/invitation-manage/${eventId}`);
    } catch (err) {
      persistInvitationPreview(null, slug);
      const message = err?.message || 'Could not save your invitation to the server.';
      setPublishError(`${message} Your content is saved locally — open Invitation Management to retry.`);
    } finally {
      setPublishing(false);
    }
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

      {step !== 1 ? (
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
                  placeholder="John & Mae"
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
              <input value={form.slug} readOnly placeholder="John-Mae" />
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
              Next: Add Content
            </button>
          </>
        )}

        {step === 2 && (
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
            {publishError && (
              <p style={{ fontSize: 13, color: '#DC3545', marginTop: 12 }}>
                {publishError}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)} disabled={publishing}>Back</button>
              <button type="button" className="btn btn-gold" onClick={handlePublish} disabled={!hasEventDate || publishing}>
                {publishing ? 'Publishing...' : 'Save & Publish'}
              </button>
              {publishError && (
                <button type="button" className="btn btn-outline" onClick={() => navigate('/client/invitation-manage')}>
                  Open Invitation Management
                </button>
              )}
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
              {fileError && (
                <p style={{ color: '#DC3545', fontSize: 13, marginTop: 20 }}>{fileError}</p>
              )}
              <div style={{ marginTop: fileError ? 12 : 20 }}>
                <MediaField
                  label="Cover Photo URL"
                  value={form.invitation.cover_image || ''}
                  onChange={(value) => updateInvitation({ cover_image: value })}
                  placeholder="https://..."
                  accept="image/*"
                  maxSizeMb={MAX_IMAGE_SIZE_MB}
                  onError={setFileError}
                />
                <MediaField
                  label="Background Video URL"
                  value={form.invitation.background_video || ''}
                  onChange={(value) => updateInvitation({ background_video: value })}
                  placeholder="https://...mp4"
                  accept="video/*"
                  maxSizeMb={MAX_VIDEO_SIZE_MB}
                  onError={setFileError}
                />
                <MediaField
                  label="Music URL"
                  value={form.invitation.music_url || ''}
                  onChange={(value) => updateInvitation({ music_url: value })}
                  placeholder="https://...mp3"
                  accept="audio/*"
                  maxSizeMb={MAX_AUDIO_SIZE_MB}
                  onError={setFileError}
                />
              </div>
            </div>

            <div className="card-widget">
              <h3>Gallery Photos</h3>
              {gallery.slice(0, 4).map((item, index) => (
                <div key={index} className="form-group" style={{ marginTop: index === 0 ? 20 : 0 }}>
                  <label>Photo {index + 1}</label>
                  <input value={item.caption || ''} onChange={(e) => updateGallery(index, { caption: e.target.value })} placeholder="Caption" />
                  <input
                    value={isDataUrl(item.image) ? getMediaFieldDisplay(item.image) : (item.image || '')}
                    readOnly={isDataUrl(item.image)}
                    onChange={(e) => updateGallery(index, { image: e.target.value })}
                    placeholder="Image URL"
                  />
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
              <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="btn btn-gold" onClick={() => setStep(2)}>Next: Publish</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
