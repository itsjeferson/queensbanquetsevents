import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DataTable from '../../components/common/Table/DataTable';
import Loader, { Spinner } from '../../components/common/Loader/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import Toast from '../../components/common/Toast/Toast';
import { eventService } from '../../services/invitationService';
import { ApiError } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import QRShare from '../../components/invitation/QRShare';
import InvitationPreviewModal from '../../components/invitation/InvitationPreviewModal';
import {
  getPreviewPath,
  openInvitationPreview,
  getClientPreviewSlug,
  getLocalInvitationDraft,
  buildInvitationPreviewData,
  saveClientPreviewSlug,
  saveInvitationDraft,
} from '../../utils/invitationPreview';
import { normalizeEventDateForApi, toDatetimeLocalValue } from '../../utils/eventDate';
import { normalizeInvitationContent, normalizeWeddingProgram, prepareInvitationForApiSave } from '../../utils/invitationContent';
import { getInvitationShareUrl } from '../../utils/invitationShare';
import { eventStatusMeta as statusMeta } from '../../utils/eventStatus';
import WeddingContentFields from '../../components/invitation/WeddingContentFields';
import RoyalLuxuryContentFields from '../../components/invitation/RoyalLuxuryContentFields';
import InvitationExperienceSettings from '../../components/invitation/InvitationExperienceSettings';
import InvitationTemplateSelector from '../../components/invitation/InvitationTemplateSelector';
import '../../styles/invitation.css';

const AUTO_SAVE_DELAY_MS = 600;

function mapInvitationFromApi(invitation) {
  return normalizeInvitationContent(invitation || {});
}

const MANAGE_CONFIG = {
  client: {
    title: 'Invitation Management',
    subtitle: 'Manage your event invitations and guest lists.',
    basePath: '/client/invitation-manage',
    builderPath: '/client/invitation-builder',
    rsvpPath: '/client/rsvp-monitoring',
    showCreateButton: true,
  },
  admin: {
    title: 'Invitation Manager',
    subtitle: 'Review and manage all client event invitations.',
    basePath: '/admin/invitation-manager',
    rsvpPath: '/admin/rsvp-monitoring',
    showCreateButton: false,
  },
};

function InvitationManagerList({ variant = 'client' }) {
  const { user } = useAuth();
  const config = MANAGE_CONFIG[variant];
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  const loadEvents = useCallback(() => {
    const clientId = variant === 'admin' ? undefined : user?.id;
    setLoading(true);
    eventService.getAll(clientId)
      .then((res) => {
        setEvents(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, variant]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(''), 3200);
  };

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const confirmReview = async () => {
    if (!reviewTarget) return;
    const { id, action } = reviewTarget;
    setReviewLoading(true);
    try {
      if (action === 'approve') {
        await eventService.approvePublish(id);
        showToast('Invitation approved and published.');
      } else if (action === 'decline') {
        await eventService.declinePublish(id);
        showToast('Publish request declined.');
      } else if (action === 'delete') {
        await eventService.delete(id);
        showToast('Invitation deleted.');
      }
      setReviewTarget(null);
      loadEvents();
    } catch {
      showToast('Could not complete that action. Please try again.');
      setReviewTarget(null);
    } finally {
      setReviewLoading(false);
    }
  };

  const REVIEW_META = {
    approve: {
      title: 'Approve & Publish',
      message: (name) => `Approve "${name}" and make it live for guests?`,
      confirmLabel: 'Approve',
      loadingLabel: 'Approving...',
      tone: 'default',
    },
    decline: {
      title: 'Decline Publish Request',
      message: (name) => `Decline the publish request for "${name}"? It will go back to draft for the client to revise.`,
      confirmLabel: 'Decline',
      loadingLabel: 'Declining...',
      tone: 'danger',
    },
    delete: {
      title: 'Delete Invitation',
      message: (name) => `Delete "${name}"? Its public link will stop working and it will be removed from this list. This can't be undone from here.`,
      confirmLabel: 'Delete',
      loadingLabel: 'Deleting...',
      tone: 'danger',
    },
  };

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>
        {config.showCreateButton && (
          <Link to={config.builderPath} className="btn btn-gold">+ Create Invitation</Link>
        )}
      </div>
      {loading ? (
        <Loader variant="page" label="Loading invitations..." />
      ) : (
      <div className="card-widget">
        <DataTable
          columns={[
            { key: 'event_name', label: 'Event' },
            { key: 'event_type', label: 'Type' },
            { key: 'event_date', label: 'Date' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={events}
          renderCell={(key, row) => {
            if (key === 'event_name') return <strong>{row.event_name}</strong>;
            if (key === 'event_type') return <span className="badge badge-gold">{row.event_type}</span>;
            if (key === 'event_date') return new Date(row.event_date).toLocaleDateString();
            if (key === 'status') return <span className={`badge ${statusMeta(row.status).badge}`}>{statusMeta(row.status).label}</span>;
            if (key === 'actions') return (
              <span>
                <Link to={`${config.basePath}/${row.id}`} className="action-btn">Edit</Link>
                {row.status === 'published' && row.slug && (
                  <a
                    href={getInvitationShareUrl({ slug: row.slug, guestPreview: true })}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn"
                  >
                    View
                  </a>
                )}
                {variant === 'admin' && row.status === 'pending_approval' && (
                  <>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => setReviewTarget({ id: row.id, action: 'approve', eventName: row.event_name })}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="action-btn danger"
                      onClick={() => setReviewTarget({ id: row.id, action: 'decline', eventName: row.event_name })}
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="action-btn danger"
                  onClick={() => setReviewTarget({ id: row.id, action: 'delete', eventName: row.event_name })}
                >
                  Delete
                </button>
              </span>
            );
            return row[key];
          }}
        />
      </div>
      )}

      <ConfirmDialog
        isOpen={!!reviewTarget}
        title={reviewTarget ? REVIEW_META[reviewTarget.action].title : ''}
        message={reviewTarget ? REVIEW_META[reviewTarget.action].message(reviewTarget.eventName) : ''}
        confirmLabel={reviewTarget ? REVIEW_META[reviewTarget.action].confirmLabel : ''}
        cancelLabel="Cancel"
        tone={reviewTarget ? REVIEW_META[reviewTarget.action].tone : 'default'}
        loadingLabel={reviewTarget ? REVIEW_META[reviewTarget.action].loadingLabel : ''}
        loading={reviewLoading}
        onConfirm={confirmReview}
        onCancel={() => setReviewTarget(null)}
      />

      <Toast show={!!toastMessage} message={toastMessage} />
    </>
  );
}

export default function InvitationManage({ variant = 'client' }) {
  const { id } = useParams();
  const { user } = useAuth();
  const config = MANAGE_CONFIG[variant];
  if (!id) return <InvitationManagerList variant={variant} />;
  const [event, setEvent] = useState(null);
  const [invitation, setInvitation] = useState(() => normalizeInvitationContent());
  const [saveStatus, setSaveStatus] = useState('idle');
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [usingLocalDraft, setUsingLocalDraft] = useState(false);
  const [fileError, setFileError] = useState('');
  const [saveError, setSaveError] = useState('');
  const readyToTrackChanges = useRef(false);
  const autoSaveTimerRef = useRef(null);
  const savingRef = useRef(false);
  const pendingSyncRef = useRef(null);
  const invitationRef = useRef(invitation);
  const toastTimerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState('');
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    invitationRef.current = invitation;
  }, [invitation]);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(''), 3500);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const invitationFingerprint = useCallback(
    (value) => JSON.stringify(prepareInvitationForApiSave(value)),
    [],
  );

  const markDirty = useCallback(() => {
    setDirty(true);
    setSaveStatus('unsaved');
  }, []);

  useEffect(() => {
    readyToTrackChanges.current = false;
    setDirty(false);
    setSaveStatus('idle');
    setSaveError('');

    let cancelled = false;

    async function loadEvent() {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const res = await eventService.getById(id);
          if (cancelled) return;
          setEvent(res.data.event);
          setInvitation(mapInvitationFromApi(res.data.invitation));
          setLoadError(false);
          setUsingLocalDraft(false);
          return;
        } catch (err) {
          if (attempt === 0) {
            await new Promise((resolve) => window.setTimeout(resolve, 1500));
          }
        }
      }

      const draft =
        getLocalInvitationDraft(id)
        || getLocalInvitationDraft(getClientPreviewSlug(user?.id));

      if (cancelled) return;

      if (draft?.event) {
        setEvent({ ...draft.event, id: draft.event.id ?? Number(id) });
        setInvitation(mapInvitationFromApi(draft.invitation));
        setLoadError(false);
        setUsingLocalDraft(true);
        return;
      }

      setEvent(null);
      setLoadError(true);
    }

    loadEvent().finally(() => {
      if (!cancelled) {
        window.setTimeout(() => {
          readyToTrackChanges.current = true;
        }, 0);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id, user?.id]);

  const shareUrl = useMemo(() => {
    if (!event) return '';
    return getInvitationShareUrl({
      slug: event.slug,
      saveTheDateEnabled: Boolean(invitation.save_the_date_enabled),
    });
  }, [event, invitation]);

  const codeUrl = useMemo(() => {
    if (!event) return '';
    return getInvitationShareUrl({ inviteCode: event.invite_code });
  }, [event]);

  const updateEvent = (patch) => {
    markDirty();
    setEvent((current) => ({ ...current, ...patch }));
  };

  const updateInvitation = (patch) => {
    markDirty();
    setInvitation((current) => ({ ...current, ...patch }));
  };

  const handleSelectTemplate = (template) => {
    const config = template.theme_config || {};
    markDirty();
    setInvitation((current) => ({
      ...current,
      template_id: template.id,
      primary_color: config.primary || '#D4AF37',
      secondary_color: config.accent || '#F4EEE7',
      font_family: config.font || 'Playfair Display',
    }));
  };

  const updateVenue = (type, field, value) => {
    markDirty();
    setInvitation((current) => ({
      ...current,
      venue: {
        ...current.venue,
        [type]: { ...(current.venue?.[type] || {}), [field]: value },
      },
    }));
  };

  const updateStory = (story) => {
    markDirty();
    setInvitation((current) => ({ ...current, story }));
  };

  const updateEntourage = (entourage) => {
    markDirty();
    setInvitation((current) => ({ ...current, entourage }));
  };

  const updateAttire = (field, value) => {
    markDirty();
    setInvitation((current) => ({
      ...current,
      attire: { ...(current.attire || {}), [field]: value },
    }));
  };

  const updateProgram = (index, field, value) => {
    markDirty();
    setInvitation((current) => {
      const program = normalizeWeddingProgram(current.program);
      program[index] = { ...(program[index] || {}), [field]: value };
      return { ...current, program };
    });
  };

  const updateFaq = (index, field, value) => {
    markDirty();
    setInvitation((current) => {
      const faqs = [...(current.faqs || [])];
      faqs[index] = { ...(faqs[index] || {}), [field]: value };
      return { ...current, faqs };
    });
  };

  const updateGallery = (index, patch) => {
    markDirty();
    setInvitation((current) => {
      const gallery = [...(current.gallery || [])];
      gallery[index] = { ...(gallery[index] || {}), ...patch };
      return { ...current, gallery };
    });
  };

  const persistLocalDraft = useCallback(() => {
    if (!event) return;

    const normalizedEvent = {
      ...event,
      event_date: normalizeEventDateForApi(event.event_date),
    };
    const previewData = buildInvitationPreviewData({
      event: normalizedEvent,
      invitation: invitationRef.current,
      guest_messages: [],
    });

    saveInvitationDraft(previewData);
    if (variant === 'client') saveClientPreviewSlug(user?.id, normalizedEvent?.slug);
  }, [event, user?.id, variant]);

  const syncToServer = useCallback(async ({ publish = false, publishMode = 'direct' } = {}) => {
    if (!event) return false;

    if (savingRef.current) {
      pendingSyncRef.current = {
        publish: publish || pendingSyncRef.current?.publish,
        publishMode: publish ? publishMode : (pendingSyncRef.current?.publishMode || 'direct'),
      };
      return false;
    }

    savingRef.current = true;
    setSaveStatus('saving');
    setSaveError('');

    const normalizedEvent = {
      ...event,
      event_date: normalizeEventDateForApi(event.event_date),
    };
    const savedSnapshot = invitationFingerprint(invitationRef.current);
    persistLocalDraft();

    const payload = {
      ...normalizedEvent,
      client_id: user?.id,
      invitation: JSON.parse(savedSnapshot),
    };

    try {
      const updateRes = await eventService.update(id, payload);
      if (publish) {
        if (publishMode === 'request') {
          await eventService.requestPublish(id);
        } else {
          await eventService.publish(id);
        }
      }

      const publishedStatus = publishMode === 'request' ? 'pending_approval' : 'published';

      if (updateRes.data) {
        setEvent((current) => ({
          ...current,
          ...updateRes.data,
          status: publish ? publishedStatus : (updateRes.data.status ?? current.status),
        }));
      } else if (publish) {
        setEvent((current) => ({ ...current, status: publishedStatus }));
      }

      setUsingLocalDraft(false);

      if (invitationFingerprint(invitationRef.current) === savedSnapshot) {
        setDirty(false);
        setSaveStatus('saved');
      } else {
        setSaveStatus('syncing');
        pendingSyncRef.current = { publish: false };
      }
      return true;
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : (err?.message || 'Could not save your changes.');
      setSaveError(message);
      setSaveStatus('error');
      return false;
    } finally {
      savingRef.current = false;
      const pending = pendingSyncRef.current;
      pendingSyncRef.current = null;
      if (pending) {
        syncToServer(pending);
      }
    }
  }, [event, id, invitationFingerprint, persistLocalDraft]);

  useEffect(() => {
    if (!readyToTrackChanges.current || !dirty || !event) return undefined;

    persistLocalDraft();
    setSaveStatus('syncing');

    autoSaveTimerRef.current = window.setTimeout(() => {
      syncToServer({ publish: false });
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [dirty, event, invitation, persistLocalDraft, syncToServer]);

  useEffect(() => {
    if (saveStatus !== 'saved') return undefined;

    showToast('Your changes have been saved.');
    const resetTimer = window.setTimeout(() => setSaveStatus('idle'), 3500);

    return () => window.clearTimeout(resetTimer);
  }, [saveStatus, showToast]);

  const handleUpdateNow = () => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    persistLocalDraft();
    syncToServer({ publish: false });
  };

  const confirmPublish = async () => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    setPublishing(true);
    persistLocalDraft();
    const publishMode = variant === 'admin' ? 'direct' : 'request';
    const ok = await syncToServer({ publish: true, publishMode });
    setPublishing(false);
    setPublishConfirmOpen(false);
    if (ok) {
      showToast(
        publishMode === 'request'
          ? 'Publish request sent to the admin for review.'
          : 'Invitation published successfully.',
      );
    }
  };

  const confirmApprove = async () => {
    setReviewLoading(true);
    try {
      await eventService.approvePublish(id);
      setEvent((current) => ({ ...current, status: 'published' }));
      showToast('Invitation approved and published.');
      setApproveConfirmOpen(false);
    } catch {
      setSaveError('Could not approve this invitation. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const confirmDecline = async () => {
    setReviewLoading(true);
    try {
      await eventService.declinePublish(id);
      setEvent((current) => ({ ...current, status: 'draft' }));
      showToast('Publish request declined.');
      setDeclineConfirmOpen(false);
    } catch {
      setSaveError('Could not decline this invitation. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handlePreviewInvitation = () => {
    persistLocalDraft();
    window.open(
      openInvitationPreview(event.slug, { saveTheDateEnabled: Boolean(invitation.save_the_date_enabled) }),
      '_blank',
      'noopener,noreferrer',
    );
  };

  if (loadError) {
    return (
      <div className="card-widget">
        <h3>Invitation not found</h3>
        <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>
          This invitation could not be loaded from the server. If you just published, try opening Invitation Management from the sidebar to see your events list.
        </p>
        <Link to="/client/invitation-manage" className="btn btn-gold" style={{ marginTop: 16 }}>
          Back to Invitation Management
        </Link>
      </div>
    );
  }
  if (!event) return <Loader variant="page" label="Loading invitation..." />;

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>{event.event_name}</h1>
          <p>{event.event_type} - {new Date(event.event_date).toLocaleDateString()} - <span className={`badge ${statusMeta(event.status).badge}`}>{statusMeta(event.status).label}</span></p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-gold"
            onClick={handleUpdateNow}
            disabled={saveStatus === 'saving' || !dirty}
          >
            {saveStatus === 'saving' ? (
              <span className="btn-loading">
                <Spinner size="sm" tone="light" />
                <span>Saving...</span>
              </span>
            ) : 'Update Invitation'}
          </button>
          {event.status === 'draft' && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setPublishConfirmOpen(true)}
              disabled={saveStatus === 'saving'}
            >
              {variant === 'admin' ? 'Publish' : 'Request Publish'}
            </button>
          )}
          {event.status === 'pending_approval' && variant === 'admin' && (
            <>
              <button type="button" className="btn btn-gold" onClick={() => setApproveConfirmOpen(true)}>Approve</button>
              <button type="button" className="btn btn-outline" onClick={() => setDeclineConfirmOpen(true)}>Decline</button>
            </>
          )}
          {variant === 'admin' && (
            <button type="button" className="btn btn-outline" onClick={() => setPreviewOpen(true)}>Preview Invitation</button>
          )}
          {event.slug && variant === 'client' && (
            <button type="button" className="btn btn-outline" onClick={handlePreviewInvitation}>
              Preview Invitation
            </button>
          )}
        </div>
      </div>

      {event.status === 'pending_approval' && (
        <div className="card-widget" style={{ borderColor: 'rgba(57,90,128,0.35)', background: 'rgba(57,90,128,0.08)' }}>
          {variant === 'admin'
            ? 'This invitation is awaiting your approval before it can go live. Review the content below, then Approve or Decline using the buttons above.'
            : "Your publish request has been submitted and is awaiting admin approval. You'll see it marked Published here once it's approved."}
        </div>
      )}

      {fileError && (
        <div className="card-widget" style={{ borderColor: 'rgba(220,53,69,0.35)', background: 'rgba(220,53,69,0.06)' }}>
          {fileError}
        </div>
      )}

      {usingLocalDraft && (
        <div className="card-widget" style={{ borderColor: 'rgba(212,175,55,0.45)', background: 'rgba(212,175,55,0.08)' }}>
          Could not reach the server — showing your locally saved draft. Click Update Invitation to sync your latest changes.
        </div>
      )}

      {saveStatus === 'syncing' && (
        <div className="card-widget" style={{ borderColor: 'rgba(212,175,55,0.35)', background: 'rgba(212,175,55,0.08)' }}>
          Draft saved locally — syncing to server...
        </div>
      )}

      {saveStatus === 'saving' && (
        <div className="card-widget" style={{ borderColor: 'rgba(212,175,55,0.35)', background: 'rgba(212,175,55,0.08)' }}>
          Saving to server...
        </div>
      )}

      {saveStatus === 'unsaved' && (
        <div className="card-widget" style={{ borderColor: 'rgba(212,175,55,0.35)', background: 'rgba(212,175,55,0.06)' }}>
          Editing...
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="card-widget" style={{ borderColor: 'rgba(220,53,69,0.35)', background: 'rgba(220,53,69,0.06)' }}>
          {saveError || 'Could not save your changes.'} Click Update Invitation to try again.
        </div>
      )}

      <div className="card-widget">
        <h3>Event Settings</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Event Name</label>
            <input value={event.event_name || ''} onChange={(e) => updateEvent({ event_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Event Date</label>
            <input type="datetime-local" value={toDatetimeLocalValue(event.event_date)} onChange={(e) => updateEvent({ event_date: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Hiding templates selection for future integration
      {event.event_type === 'wedding' && (
        <div className="card-widget">
          <h3>Design Template</h3>
          <InvitationTemplateSelector
            selectedId={invitation.template_id}
            onSelect={handleSelectTemplate}
            category="wedding"
            currentForm={{ event_name: event.event_name, event_date: event.event_date, slug: event.slug, invitation }}
          />
        </div>
      )}
      */}

      <InvitationExperienceSettings
        invitation={invitation}
        onChange={updateInvitation}
        onFileError={setFileError}
      />

      <WeddingContentFields
        invitation={invitation}
        event={event}
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
        <h3>Share Your Invitation</h3>
        <div className="card-form-stack">
          <div className="form-group">
            <label>Slug URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input readOnly value={shareUrl} />
              <button type="button" className="action-btn" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
            </div>
          </div>
          <div className="form-group">
            <label>Code URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input readOnly value={codeUrl} />
              <button type="button" className="action-btn" onClick={() => navigator.clipboard.writeText(codeUrl)}>Copy</button>
            </div>
          </div>
          <p className="form-help">Invite Code: <strong>{event.invite_code}</strong></p>
          {invitation?.qr_enabled && <QRShare url={shareUrl} enabled />}
          <Link to={config.rsvpPath} className="btn btn-outline">RSVP Monitoring</Link>
        </div>
      </div>

      <InvitationPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={{
          event,
          invitation,
          guest_messages: [],
        }}
      />

      <ConfirmDialog
        isOpen={publishConfirmOpen}
        title={variant === 'admin' ? 'Publish Invitation' : 'Request Publish'}
        message={
          variant === 'admin'
            ? `Publish "${event.event_name}" and make it live for guests?`
            : `Send "${event.event_name}" to the admin for approval? It will go live once approved.`
        }
        confirmLabel={variant === 'admin' ? 'Publish' : 'Send Request'}
        cancelLabel="Cancel"
        loadingLabel={variant === 'admin' ? 'Publishing...' : 'Sending...'}
        loading={publishing}
        onConfirm={confirmPublish}
        onCancel={() => setPublishConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={approveConfirmOpen}
        title="Approve & Publish"
        message={`Approve "${event.event_name}" and make it live for guests?`}
        confirmLabel="Approve"
        cancelLabel="Cancel"
        loadingLabel="Approving..."
        loading={reviewLoading}
        onConfirm={confirmApprove}
        onCancel={() => setApproveConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={declineConfirmOpen}
        title="Decline Publish Request"
        message={`Decline the publish request for "${event.event_name}"? It will go back to draft for the client to revise.`}
        confirmLabel="Decline"
        cancelLabel="Cancel"
        tone="danger"
        loadingLabel="Declining..."
        loading={reviewLoading}
        onConfirm={confirmDecline}
        onCancel={() => setDeclineConfirmOpen(false)}
      />

      <Toast show={!!toastMessage} message={toastMessage} />
    </>
  );
}
