import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import {
  buildInvitationPreviewData,
  getPreviewPath,
  openInvitationPreview,
  saveClientPreviewSlug,
  saveInvitationDraft,
} from '../../utils/invitationPreview';
import { slugFromEventName } from '../../utils/slug';
import { defaultWeddingInvitationContent, normalizeInvitationContent, normalizeWeddingProgram, prepareInvitationForApiSave } from '../../utils/invitationContent';
import WeddingContentFields from '../../components/invitation/WeddingContentFields';
import RoyalLuxuryContentFields from '../../components/invitation/RoyalLuxuryContentFields';
import InvitationExperienceSettings from '../../components/invitation/InvitationExperienceSettings';
import InvitationTemplateSelector from '../../components/invitation/InvitationTemplateSelector';
import '../../styles/invitation.css';

/* ── SVG event-type icons (Lucide-style: 24×24, stroke currentColor) ── */
const evtIconProps = {
  width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true,
};

const WeddingIcon = () => (
  <svg {...evtIconProps}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const DebutIcon = () => (
  <svg {...evtIconProps}>
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
    <path d="M5.5 21h13" />
  </svg>
);
const BirthdayIcon = () => (
  <svg {...evtIconProps}>
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v3" /><path d="M12 8v3" /><path d="M17 8v3" />
    <path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" />
  </svg>
);
const AnniversaryIcon = () => (
  <svg {...evtIconProps}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
  </svg>
);
const CorporateIcon = () => (
  <svg {...evtIconProps}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" /><path d="M16 14h.01" />
    <path d="M8 10h.01" /><path d="M8 14h.01" />
  </svg>
);

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', Icon: WeddingIcon },
  { value: 'debut', label: 'Debut', Icon: DebutIcon },
  { value: 'birthday', label: 'Birthday', Icon: BirthdayIcon },
  { value: 'anniversary', label: 'Anniversary', Icon: AnniversaryIcon },
  { value: 'corporate', label: 'Corporate', Icon: CorporateIcon },
];

const STEPS = ['Event Info', 'Content', 'Submit'];

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
    template_id: 3,
    invitation: normalizeInvitationContent(defaultWeddingInvitationContent),
  });

  const updateInvitation = (patch) => {
    setForm((current) => ({
      ...current,
      invitation: { ...current.invitation, ...patch },
    }));
  };

  const handleSelectTemplate = (template) => {
    const config = template.theme_config || {};
    setForm((current) => ({
      ...current,
      template_id: template.id,
      invitation: {
        ...current.invitation,
        primary_color: config.primary || '#D4AF37',
        secondary_color: config.accent || '#F4EEE7',
        font_family: config.font || 'Playfair Display',
      },
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
      const program = normalizeWeddingProgram(current.invitation.program);
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

  const persistInvitationPreview = (eventId, slug, status = eventId ? 'pending_approval' : 'draft') => {
    const previewData = buildInvitationPreviewData({
      event: {
        id: eventId ?? undefined,
        event_name: form.event_name,
        event_type: form.event_type,
        event_date: form.event_date,
        slug,
        status,
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

      persistInvitationPreview(eventId, slug, 'draft');
      await eventService.requestPublish(eventId);
      persistInvitationPreview(eventId, slug, 'pending_approval');
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

      <div className="inv-stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`inv-stepper-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            {i > 0 && <span className="inv-stepper-line" />}
            <span className="inv-stepper-circle">
              {i < step ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="inv-stepper-label">{s}</span>
          </div>
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
            <div className="inv-builder-section-header">
              <h3>Event Information</h3>
              <span className="inv-builder-gold-line" />
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Event Type</label>
              <div className="evt-type-grid">
                {EVENT_TYPES.map((type) => {
                  const IconCmp = type.Icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      className={`evt-type-card ${form.event_type === type.value ? 'selected' : ''}`}
                      onClick={() => setForm({ ...form, event_type: type.value })}
                    >
                      <span className="evt-type-icon"><IconCmp /></span>
                      <span className="evt-type-label">{type.label}</span>
                    </button>
                  );
                })}
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

            {/* Hiding templates selection for future integration
            {form.event_type === 'wedding' && (
              <InvitationTemplateSelector
                selectedId={form.template_id}
                onSelect={handleSelectTemplate}
                category="wedding"
                currentForm={form}
              />
            )}
            */}

            {!hasEventName && (
              <p style={{ fontSize: 13, color: '#DC3545', marginBottom: 12, marginTop: 12 }}>
                Enter an event name to continue.
              </p>
            )}
            <button
              type="button"
              className="btn btn-gold btn-next-step"
              onClick={() => setStep(1)}
              disabled={!hasEventName}
            >
              Next: Add Content
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Ready to Submit for Approval</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: -8, marginBottom: 16 }}>
              Your invitation will be saved and sent to the admin for review. It goes live once approved.
            </p>
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
                Go back to Event Info and select an event date before submitting.
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
                {publishing ? 'Submitting...' : 'Save & Submit for Approval'}
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
          {form.template_id === 3 ? (
            <RoyalLuxuryContentFields
              invitation={form.invitation}
              event={builderEvent}
              onInvitationChange={updateInvitation}
              onVenueChange={updateVenue}
              onProgramChange={updateProgram}
              onFileError={setFileError}
            />
          ) : (
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
          )}

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
                    openInvitationPreview(slug, { saveTheDateEnabled: Boolean(form.invitation.save_the_date_enabled) }),
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
              >
                Preview Invitation
              </button>
              <button type="button" className="btn btn-gold" onClick={() => setStep(2)}>Next: Review & Submit</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
