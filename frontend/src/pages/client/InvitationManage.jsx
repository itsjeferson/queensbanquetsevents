import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DataTable from '../../components/common/Table/DataTable';
import { eventService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import QRShare from '../../components/invitation/QRShare';
import InvitationPreviewModal from '../../components/invitation/InvitationPreviewModal';
import {
  getPreviewPath,
  getClientPreviewSlug,
  getLocalInvitationDraft,
  buildInvitationPreviewData,
  saveClientPreviewSlug,
  saveInvitationDraft,
} from '../../utils/invitationPreview';
import { normalizeEventDateForApi, toDatetimeLocalValue } from '../../utils/eventDate';
import MediaField from '../../components/common/MediaField/MediaField';
import { getMediaFieldDisplay, isDataUrl, readFileAsDataUrl, MAX_AUDIO_SIZE_MB, MAX_IMAGE_SIZE_MB, MAX_VIDEO_SIZE_MB } from '../../utils/mediaUpload';

const INVITATION_ENTRY = '/#';
const AUTO_SAVE_DELAY_MS = 600;

const emptyInvitation = {
  opening_line: '',
  hero_caption: '',
  quote: '',
  quote_source: '',
  rsvp_note: '',
  coordinator: '',
  coordinator_phone: '',
  cover_image: '',
  background_video: '',
  music_url: '',
  dress_code: '',
  story: { title: '', sections: [{ heading: '', content: '' }] },
  venue: {
    ceremony: { name: '', address: '', time: '', map_url: '' },
    reception: { name: '', address: '', time: '', map_url: '' },
  },
  program: [],
  gallery: [],
  videos: [],
  gift_registry: { preferences: '' },
  attire: { guests: '' },
  faqs: [],
  entourage: null,
  qr_enabled: 1,
};


const demoEvents = [];

function mapInvitationFromApi(invitation) {
  const merged = { ...emptyInvitation, ...(invitation || {}) };
  merged.gallery = Array.isArray(merged.gallery) ? merged.gallery : [];
  return merged;
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
  const [events, setEvents] = useState(demoEvents);
  const statusBadge = { published: 'badge-green', draft: 'badge-gray', archived: 'badge-red' };

  useEffect(() => {
    const clientId = variant === 'admin' ? undefined : user?.id;
    eventService.getAll(clientId).then((res) => {
      if (res.data?.length) setEvents(res.data);
    }).catch(() => {});
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
                  <a href={`${INVITATION_ENTRY}/invite/${row.slug}`} target="_blank" rel="noreferrer" className="action-btn">View</a>
                )}
              </span>
            );
            return row[key];
          }}
        />
      </div>
    </>
  );
}

export default function InvitationManage({ variant = 'client' }) {
  const { id } = useParams();
  const { user } = useAuth();
  const config = MANAGE_CONFIG[variant];
  if (!id) return <InvitationManagerList variant={variant} />;
  const [event, setEvent] = useState(null);
  const [invitation, setInvitation] = useState(emptyInvitation);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [usingLocalDraft, setUsingLocalDraft] = useState(false);
  const [fileError, setFileError] = useState('');
  const readyToTrackChanges = useRef(false);
  const autoSaveTimerRef = useRef(null);
  const savingRef = useRef(false);

  const markDirty = useCallback(() => {
    setDirty(true);
    setSaveStatus('unsaved');
  }, []);

  useEffect(() => {
    readyToTrackChanges.current = false;
    setDirty(false);
    setSaveStatus('idle');

    eventService.getById(id).then((res) => {
      setEvent(res.data.event);
      setInvitation(mapInvitationFromApi(res.data.invitation));
      setLoadError(false);
      setUsingLocalDraft(false);
    }).catch(() => {
      const draft =
        getLocalInvitationDraft(id)
        || getLocalInvitationDraft(getClientPreviewSlug(user?.id));

      if (draft?.event) {
        setEvent({ ...draft.event, id: draft.event.id ?? Number(id) });
        setInvitation(mapInvitationFromApi(draft.invitation));
        setLoadError(false);
        setUsingLocalDraft(true);
        return;
      }

      setEvent(null);
      setLoadError(true);
    }).finally(() => {
      window.setTimeout(() => {
        readyToTrackChanges.current = true;
      }, 0);
    });
  }, [id, user?.id]);

  const shareUrl = useMemo(() => {
    if (!event) return '';
    return `${window.location.origin}${INVITATION_ENTRY}/invite/${event.slug}`;
  }, [event]);

  const codeUrl = useMemo(() => {
    if (!event) return '';
    return `${window.location.origin}${INVITATION_ENTRY}/event/${event.invite_code}`;
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

  const updateStorySection = (index, field, value) => {
    markDirty();
    setInvitation((current) => {
      const sections = [...(current.story?.sections || [])];
      sections[index] = { ...(sections[index] || {}), [field]: value };
      return { ...current, story: { ...(current.story || {}), sections } };
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

  const handleFile = async (file, onValue) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file, MAX_IMAGE_SIZE_MB);
      onValue(dataUrl);
      setFileError('');
    } catch (err) {
      setFileError(err.message || 'Could not upload file.');
    }
  };

  const persistLocalDraft = useCallback(() => {
    if (!event) return;

    const normalizedEvent = {
      ...event,
      event_date: normalizeEventDateForApi(event.event_date),
    };
    const previewData = buildInvitationPreviewData({
      event: normalizedEvent,
      invitation,
      guest_messages: [],
    });

    saveInvitationDraft(previewData);
    if (variant === 'client') saveClientPreviewSlug(user?.id, normalizedEvent?.slug);
  }, [event, invitation, user?.id, variant]);

  const syncToServer = useCallback(async ({ publish = false } = {}) => {
    if (!event || savingRef.current) return false;

    savingRef.current = true;
    setSaveStatus('saving');

    const normalizedEvent = {
      ...event,
      event_date: normalizeEventDateForApi(event.event_date),
    };
    persistLocalDraft();

    const payload = {
      ...normalizedEvent,
      client_id: user?.id,
      invitation,
    };

    try {
      if (usingLocalDraft && user?.id) {
        const res = await eventService.create(payload);
        const created = res.data;
        if (!created?.id) throw new Error('Create failed');
        if (publish) await eventService.publish(created.id);

        setEvent((current) => ({
          ...current,
          ...created,
          status: publish ? 'published' : created.status,
        }));
        setUsingLocalDraft(false);
        setDirty(false);
        setSaveStatus('saved');

        if (String(created.id) !== String(id)) {
          window.location.replace(`${config.basePath}/${created.id}`);
        }
        return true;
      }

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
      setDirty(false);
      setSaveStatus('saved');
      return true;
    } catch {
      setSaveStatus('error');
      return false;
    } finally {
      savingRef.current = false;
    }
  }, [config.basePath, event, id, invitation, persistLocalDraft, user?.id, usingLocalDraft]);

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
  if (!event) return <p>Loading invitation...</p>;

  const gallery = invitation.gallery?.length ? invitation.gallery : [{ caption: '', image: '' }];
  const firstStory = invitation.story?.sections?.[0] || {};

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
            {saveStatus === 'saving' ? 'Saving...' : 'Update Invitation'}
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
            <a href={getPreviewPath(event.slug)} target="_blank" rel="noreferrer" className="btn btn-outline">Preview Invitation</a>
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
          Showing your locally saved draft. Click Update Invitation to sync it to the server.
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
          Could not save your changes. Click Update Invitation to try again.
        </div>
      )}

      <div className="dash-grid">
        <div className="card-widget">
          <h3>Invitation Details</h3>
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
          <div className="form-row">
            <div className="form-group">
              <label>Opening Line</label>
              <input value={invitation.opening_line || ''} onChange={(e) => updateInvitation({ opening_line: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Hero Caption</label>
              <input value={invitation.hero_caption || ''} onChange={(e) => updateInvitation({ hero_caption: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Quote</label>
            <textarea value={invitation.quote || ''} onChange={(e) => updateInvitation({ quote: e.target.value })} />
          </div>
        </div>

        <div className="card-widget">
          <h3>Share Your Invitation</h3>
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
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Invite Code: <strong>{event.invite_code}</strong></p>
          {invitation?.qr_enabled && <QRShare url={shareUrl} enabled />}
        </div>
      </div>

      <div className="dash-grid">
        <div className="card-widget">
          <h3>Photos, Music & Video</h3>
          <MediaField
            label="Cover Photo URL"
            value={invitation.cover_image || ''}
            onChange={(value) => updateInvitation({ cover_image: value })}
            placeholder="https://..."
            accept="image/*"
            maxSizeMb={MAX_IMAGE_SIZE_MB}
            onError={setFileError}
          />
          <MediaField
            label="Background Video URL"
            value={invitation.background_video || ''}
            onChange={(value) => updateInvitation({ background_video: value })}
            placeholder="https://...mp4"
            accept="video/*"
            maxSizeMb={MAX_VIDEO_SIZE_MB}
            onError={setFileError}
          />
          <MediaField
            label="Music URL"
            value={invitation.music_url || ''}
            onChange={(value) => updateInvitation({ music_url: value })}
            placeholder="https://...mp3"
            accept="audio/*"
            maxSizeMb={MAX_AUDIO_SIZE_MB}
            onError={setFileError}
          />
        </div>

        <div className="card-widget">
          <h3>Gallery Photos</h3>
          {gallery.slice(0, 4).map((item, index) => (
            <div key={index} className="form-group">
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
        <div className="form-row">
          <div className="form-group">
            <label>Story Title</label>
            <input value={invitation.story?.title || ''} onChange={(e) => updateInvitation({ story: { ...(invitation.story || {}), title: e.target.value } })} />
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
            <div key={type} style={{ marginBottom: 20 }}>
              <h4 style={{ textTransform: 'capitalize', marginBottom: 12 }}>{type}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={invitation.venue?.[type]?.name || ''} onChange={(e) => updateVenue(type, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input value={invitation.venue?.[type]?.time || ''} onChange={(e) => updateVenue(type, 'time', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={invitation.venue?.[type]?.address || ''} onChange={(e) => updateVenue(type, 'address', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Map URL</label>
                <input value={invitation.venue?.[type]?.map_url || ''} onChange={(e) => updateVenue(type, 'map_url', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <div className="card-widget">
          <h3>Attire, Gifts & FAQs</h3>
          <div className="form-group">
            <label>Dress Code</label>
            <input value={invitation.dress_code || ''} onChange={(e) => updateInvitation({ dress_code: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Guest Attire Notes</label>
            <textarea value={invitation.attire?.guests || ''} onChange={(e) => updateInvitation({ attire: { ...(invitation.attire || {}), guests: e.target.value } })} />
          </div>
          <div className="form-group">
            <label>Gift Note</label>
            <textarea value={invitation.gift_registry?.preferences || ''} onChange={(e) => updateInvitation({ gift_registry: { ...(invitation.gift_registry || {}), preferences: e.target.value } })} />
          </div>
          <div className="form-group">
            <label>Coordinator</label>
            <input value={invitation.coordinator || ''} onChange={(e) => updateInvitation({ coordinator: e.target.value })} />
          </div>
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
