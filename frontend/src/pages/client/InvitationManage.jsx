import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DataTable from '../../components/common/Table/DataTable';
import { eventService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';
import QRShare from '../../components/invitation/QRShare';
import { demoWeddingInvitation } from '../../data/demoInvitation';

const STORAGE_PREFIX = 'invitation-draft';
const INVITATION_ENTRY = '/#';

const baseInvitation = {
  ...demoWeddingInvitation.invitation,
  opening_line: 'With great joy, we invite you',
  hero_caption: 'In the union of',
  quote: 'So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.',
  quote_source: 'Matthew 19:6',
  rsvp_note: 'You are special to us. Kindly confirm your attendance below.',
  coordinator: 'Queens Banquet Events',
  coordinator_phone: '+63 917 000 0000',
  attire: {
    primary: 'Formal in champagne, gold, cream, and warm neutrals.',
    guests: 'Ladies: long dress or pantsuit. Gentlemen: long sleeves or polo with slacks.',
    reminders: 'Although we love your little ones, this is an adult-only celebration.',
  },
  faqs: [
    { question: 'Can I bring a plus one?', answer: 'Please refer to the name listed on your invitation.' },
    { question: 'Will transportation be provided?', answer: 'Kindly coordinate with the event team for shuttle details.' },
  ],
  gallery: demoWeddingInvitation.invitation.gallery,
  videos: demoWeddingInvitation.invitation.videos,
  music_url: '',
  background_video: '',
};

function mergeDraft(base, draft) {
  return {
    ...base,
    ...draft,
    event: { ...(base.event || {}), ...(draft?.event || {}) },
    invitation: { ...(base.invitation || {}), ...(draft?.invitation || {}) },
    guest_messages: draft?.guest_messages || base.guest_messages || [],
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const demoEvents = [
  { id: 1, event_name: 'John & Jane Wedding', event_type: 'wedding', event_date: '2027-07-25', slug: 'john-jane', status: 'published' },
  { id: 2, event_name: 'Maria at 18', event_type: 'debut', event_date: '2027-03-15', slug: 'maria-at-18', status: 'draft' },
];

function InvitationManagerList() {
  const { user } = useAuth();
  const [events, setEvents] = useState(demoEvents);
  const statusBadge = { published: 'badge-green', draft: 'badge-gray', archived: 'badge-red' };

  useEffect(() => {
    eventService.getAll(user?.id).then((res) => {
      if (res.data?.length) setEvents(res.data);
    }).catch(() => {});
  }, [user?.id]);

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Invitation Management</h1>
          <p>Manage your event invitations and guest lists.</p>
        </div>
        <Link to="/client/invitation-builder" className="btn btn-gold">+ Create Invitation</Link>
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
                <Link to={`/client/invitation-manage/${row.id}`} className="action-btn">Manage</Link>
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

export default function InvitationManage() {
  const { id } = useParams();
  if (!id) return <InvitationManagerList />;
  const [event, setEvent] = useState(null);
  const [invitation, setInvitation] = useState(baseInvitation);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fallback = {
      event: {
        ...demoWeddingInvitation.event,
        id,
        event_name: 'Kevin & Andy',
        slug: 'john-jane',
        invite_code: 'DEMO2027',
      },
      invitation: baseInvitation,
      guest_messages: demoWeddingInvitation.guest_messages,
    };

    eventService.getById(id).then((res) => {
      const apiData = {
        event: res.data.event,
        invitation: { ...baseInvitation, ...(res.data.invitation || {}) },
        guest_messages: res.data.guest_messages || demoWeddingInvitation.guest_messages,
      };
      const local = localStorage.getItem(`${STORAGE_PREFIX}-${id}`);
      const data = local ? mergeDraft(apiData, JSON.parse(local)) : apiData;
      setEvent(data.event);
      setInvitation(data.invitation);
    }).catch(() => {
      const local = localStorage.getItem(`${STORAGE_PREFIX}-${id}`);
      const data = local ? mergeDraft(fallback, JSON.parse(local)) : fallback;
      setEvent(data.event);
      setInvitation(data.invitation);
    });
  }, [id]);

  const shareUrl = useMemo(() => {
    if (!event) return '';
    return `${window.location.origin}${INVITATION_ENTRY}/invite/${event.slug}`;
  }, [event]);

  const codeUrl = useMemo(() => {
    if (!event) return '';
    return `${window.location.origin}${INVITATION_ENTRY}/event/${event.invite_code}`;
  }, [event]);

  const updateInvitation = (patch) => {
    setSaved(false);
    setInvitation((current) => ({ ...current, ...patch }));
  };

  const updateVenue = (type, field, value) => {
    setSaved(false);
    setInvitation((current) => ({
      ...current,
      venue: {
        ...current.venue,
        [type]: { ...(current.venue?.[type] || {}), [field]: value },
      },
    }));
  };

  const updateStorySection = (index, field, value) => {
    setSaved(false);
    setInvitation((current) => {
      const sections = [...(current.story?.sections || [])];
      sections[index] = { ...(sections[index] || {}), [field]: value };
      return { ...current, story: { ...(current.story || {}), sections } };
    });
  };

  const updateGallery = (index, patch) => {
    setSaved(false);
    setInvitation((current) => {
      const gallery = [...(current.gallery || [])];
      gallery[index] = { ...(gallery[index] || {}), ...patch };
      return { ...current, gallery };
    });
  };

  const handleFile = async (file, onValue) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    onValue(dataUrl);
  };

  const handlePublish = async () => {
    const data = {
      event,
      invitation,
      guest_messages: demoWeddingInvitation.guest_messages,
    };
    localStorage.setItem(`${STORAGE_PREFIX}-${id}`, JSON.stringify(data));
    if (event?.slug) localStorage.setItem(`${STORAGE_PREFIX}-slug-${event.slug}`, JSON.stringify(data));
    if (event?.invite_code) localStorage.setItem(`${STORAGE_PREFIX}-code-${event.invite_code}`, JSON.stringify(data));
    setSaved(true);

    try {
      await eventService.update(id, {
        ...event,
        invitation,
      });
      await eventService.publish(id);
      setEvent({ ...event, status: 'published' });
    } catch {
      setEvent({ ...event, status: 'published' });
    }
  };

  if (!event) return <p>Loading...</p>;

  const gallery = invitation.gallery?.length ? invitation.gallery : [{ caption: '', image: '' }];
  const firstStory = invitation.story?.sections?.[0] || {};

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1>{event.event_name}</h1>
          <p>{event.event_type} - {new Date(event.event_date).toLocaleDateString()} - <span className={`badge ${event.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{event.status}</span></p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-gold" onClick={handlePublish}>Save & Publish</button>
          {event.slug && <a href={`${INVITATION_ENTRY}/invite/${event.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline">Preview</a>}
        </div>
      </div>

      {saved && (
        <div className="card-widget" style={{ borderColor: 'rgba(40,167,69,0.35)', background: 'rgba(40,167,69,0.06)' }}>
          Draft saved. Open the preview link to see the updated invitation page.
        </div>
      )}

      <div className="dash-grid">
        <div className="card-widget">
          <h3>Invitation Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Event Name</label>
              <input value={event.event_name || ''} onChange={(e) => setEvent({ ...event, event_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <input type="datetime-local" value={(event.event_date || '').slice(0, 16)} onChange={(e) => setEvent({ ...event, event_date: e.target.value })} />
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
          <div className="form-group">
            <label>Cover Photo URL</label>
            <input value={invitation.cover_image || ''} onChange={(e) => updateInvitation({ cover_image: e.target.value })} placeholder="https://..." />
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateInvitation({ cover_image: value }))} />
          </div>
          <div className="form-group">
            <label>Background Video URL</label>
            <input value={invitation.background_video || ''} onChange={(e) => updateInvitation({ background_video: e.target.value })} placeholder="https://...mp4" />
            <input type="file" accept="video/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateInvitation({ background_video: value }))} />
          </div>
          <div className="form-group">
            <label>Music URL</label>
            <input value={invitation.music_url || ''} onChange={(e) => updateInvitation({ music_url: e.target.value })} placeholder="https://...mp3" />
            <input type="file" accept="audio/*" onChange={(e) => handleFile(e.target.files?.[0], (value) => updateInvitation({ music_url: value }))} />
          </div>
        </div>

        <div className="card-widget">
          <h3>Gallery Photos</h3>
          {gallery.slice(0, 4).map((item, index) => (
            <div key={index} className="form-group">
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
          <Link to="/client/rsvp-monitoring" className="btn btn-outline">RSVP Monitoring</Link>
        </div>
      </div>
    </>
  );
}
