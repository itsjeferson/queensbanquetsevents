import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import {
  buildInvitationPreviewData,
  getPreviewPath,
  saveClientPreviewSlug,
  saveInvitationDraft,
} from '../../utils/invitationPreview';
import { slugFromEventName } from '../../utils/slug';
import { defaultWeddingInvitationContent, normalizeInvitationContent, prepareInvitationForApiSave } from '../../utils/invitationContent';
import WeddingContentFields from '../../components/invitation/WeddingContentFields';
import InvitationExperienceSettings from '../../components/invitation/InvitationExperienceSettings';
import '../../styles/invitation.css';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'debut', label: 'Debut', icon: '👑' },
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'corporate', label: 'Corporate', icon: '🏢' },
];

const STEPS = ['Event Info', 'Content', 'Publish'];

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
    invitation: normalizeInvitationContent(defaultWeddingInvitationContent),
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

  const updateStory = (story) => {
    setForm((current) => ({
      ...current,
      invitation: { ...current.invitation, story },
    }));
  };

  const updateGallery = (index, patch) => {
    setForm((current) => {
      const gallery = [...(current.invitation.gallery || [])];
      gallery[index] = { ...(gallery[index] || {}), ...patch };
      return { ...current, invitation: { ...current.invitation, gallery } };
    });
  };

  const updateEntourage = (entourage) => {
    setForm((current) => ({
      ...current,
      invitation: { ...current.invitation, entourage },
    }));
  };

  const updateAttire = (field, value) => {
    setForm((current) => ({
      ...current,
      invitation: {
        ...current.invitation,
        attire: { ...(current.invitation.attire || {}), [field]: value },
      },
    }));
  };

  const updateProgram = (index, field, value) => {
    setForm((current) => {
      const program = [...(current.invitation.program || [])];
      program[index] = { ...(program[index] || {}), [field]: value };
      return { ...current, invitation: { ...current.invitation, program } };
    });
  };

  const updateFaq = (index, field, value) => {
    setForm((current) => {
      const faqs = [...(current.invitation.faqs || [])];
      faqs[index] = { ...(faqs[index] || {}), [field]: value };
      return { ...current, invitation: { ...current.invitation, faqs } };
    });
  };

  const hasEventName = form.event_name.trim().length > 0;
  const hasEventDate = Boolean(form.event_date);

  const builderEvent = {
    event_name: form.event_name,
    event_type: form.event_type,
    event_date: form.event_date,
    slug: form.slug || slugFromEventName(form.event_name),
  };

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

  useEffect(() => {
    if (!hasEventName) return;

    const slug = form.slug || slugFromEventName(form.event_name);
    persistInvitationPreview(null, slug);
  }, [form.event_name, form.event_type, form.event_date, form.slug, form.invitation, hasEventName, user?.id]);

  const handlePublish = async () => {
    const slug = form.slug || slugFromEventName(form.event_name);
    const eventPayload = {
      client_id: user?.id,
      event_name: form.event_name,
      event_type: form.event_type,
      event_date: form.event_date,
      slug,
      invitation: prepareInvitationForApiSave({ template_id: form.template_id, ...form.invitation }),
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

      {fileError && (
        <div className="card-widget" style={{ borderColor: 'rgba(220,53,69,0.35)', background: 'rgba(220,53,69,0.06)' }}>
          {fileError}
        </div>
      )}

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
                    setForm({
                      ...form,
                      event_name,
                      slug: slugFromEventName(event_name),
                      invitation: {
                        ...form.invitation,
                        couple_display_name: event_name,
                      },
                    });
                  }}
                  placeholder="Mark & She"
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
              <input value={form.slug} readOnly placeholder="Mark-She" />
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
            <InvitationExperienceSettings
              invitation={form.invitation}
              onChange={(patch) => updateInvitation(patch)}
              onFileError={setFileError}
              embedded
            />
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
          <WeddingContentFields
            invitation={form.invitation}
            event={builderEvent}
            onInvitationChange={updateInvitation}
            onVenueChange={updateVenue}
            onStoryChange={updateStory}
            onGalleryChange={updateGallery}
            onEntourageChange={updateEntourage}
            onAttireChange={updateAttire}
            onProgramChange={updateProgram}
            onFaqChange={updateFaq}
            onFileError={setFileError}
          />

          <div className="card-widget">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  const slug = form.slug || slugFromEventName(form.event_name);
                  persistInvitationPreview(null, slug);
                  window.open(
                    getPreviewPath(slug, { resetRsvp: Boolean(form.invitation.save_the_date_enabled) }),
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
              >
                Preview Invitation
              </button>
              <button type="button" className="btn btn-gold" onClick={() => setStep(2)}>Next: Publish</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
