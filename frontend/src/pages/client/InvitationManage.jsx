import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DataTable from '../../components/common/Table/DataTable';
import Loader, { Spinner } from '../../components/common/Loader/Loader';
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
import { normalizeInvitationContent, prepareInvitationForApiSave } from '../../utils/invitationContent';
import { getInvitationShareUrl } from '../../utils/invitationShare';
import WeddingContentFields from '../../components/invitation/WeddingContentFields';
import InvitationExperienceSettings from '../../components/invitation/InvitationExperienceSettings';
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
  const statusBadge = { published: 'badge-green', draft: 'badge-gray', archived: 'badge-red' };

  useEffect(() => {
    const clientId = variant === 'admin' ? undefined : user?.id;
    setLoading(true);
    eventService.getAll(clientId)
      .then((res) => {
        if (res.data?.length) setEvents(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, variant]);

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
            if (key === 'status') return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
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
              </span>
            );
            return row[key];
          }}
        />
      </div>
      )}
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

  useEffect(() => {
    invitationRef.current = invitation;
  }, [invitation]);

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
  }, [event, invitation.save_the_date_enabled]);

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
      const program = [...(current.program || [])];
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

  const syncToServer = useCallback(async ({ publish = false } = {}) => {
    if (!event) return false;

    if (savingRef.current) {
      pendingSyncRef.current = {
        publish: publish || pendingSyncRef.current?.publish,
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
      if (publish) await eventService.publish(id);

      if (updateRes.data) {
        setEvent((current) => ({
          ...current,
          ...updateRes.data,
          status: publish ? 'published' : (updateRes.data.status ?? current.status),
        }));
      } else if (publish) {
        setEvent((current) => ({ ...current, status: 'published' }));
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

  const handleUpdateNow = () => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    persistLocalDraft();
    syncToServer({ publish: false });
  };

  const handlePublish = () => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    persistLocalDraft();
    syncToServer({ publish: true });
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
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1>{event.event_name}</h1>
          <p>{event.event_type} - {new Date(event.event_date).toLocaleDateString()} - <span className={`badge ${event.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{event.status}</span></p>
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
          {event.status !== 'published' && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handlePublish}
              disabled={saveStatus === 'saving'}
            >
              Publish
            </button>
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

      {saveStatus === 'saved' && (
        <div className="card-widget" style={{ borderColor: 'rgba(40,167,69,0.35)', background: 'rgba(40,167,69,0.06)' }}>
          All changes saved. Preview updates instantly — server sync complete.
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
    </>
  );
}
