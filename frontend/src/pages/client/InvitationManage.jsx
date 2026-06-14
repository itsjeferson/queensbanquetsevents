import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/invitationService';
import QRShare from '../../components/invitation/QRShare';

export default function InvitationManage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [invitation, setInvitation] = useState(null);

  useEffect(() => {
    eventService.getById(id).then((res) => {
      setEvent(res.data.event);
      setInvitation(res.data.invitation);
    }).catch(() => {
      setEvent({ id, event_name: 'John & Jane', event_type: 'wedding', slug: 'john-jane', invite_code: 'DEMO2027', status: 'published', event_date: '2027-07-25' });
      setInvitation({ qr_enabled: 1 });
    });
  }, [id]);

  if (!event) return <p>Loading...</p>;

  const shareUrl = `${window.location.origin}/invite/${event.slug}`;
  const codeUrl = `${window.location.origin}/event/${event.invite_code}`;

  const handlePublish = async () => {
    try {
      await eventService.publish(id);
      setEvent({ ...event, status: 'published' });
    } catch {
      setEvent({ ...event, status: 'published' });
    }
  };

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{event.event_name}</h1>
          <p>{event.event_type} • {new Date(event.event_date).toLocaleDateString()} • <span className={`badge ${event.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{event.status}</span></p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {event.status !== 'published' && (
            <button type="button" className="btn btn-gold" onClick={handlePublish}>Publish</button>
          )}
          {event.slug && (
            <a href={`/invite/${event.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline">Preview</a>
          )}
        </div>
      </div>

      <div className="dash-grid">
        <div className="card-widget">
          <h3>Share Your Invitation</h3>
          <div style={{ marginBottom: 16 }}>
            <label>Slug URL</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input readOnly value={shareUrl} style={{ flex: 1 }} />
              <button type="button" className="action-btn" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Code URL</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input readOnly value={codeUrl} style={{ flex: 1 }} />
              <button type="button" className="action-btn" onClick={() => navigator.clipboard.writeText(codeUrl)}>Copy</button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Invite Code: <strong>{event.invite_code}</strong></p>
          {invitation?.qr_enabled && <QRShare url={shareUrl} enabled />}
        </div>

        <div className="card-widget">
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to={`/client/invitations/${id}/guests`} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>👥 Guest Management</Link>
            <Link to={`/client/invitations/${id}/rsvp`} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>📊 RSVP Monitoring</Link>
            <Link to="/client/invitations/builder" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>✏️ Edit Invitation</Link>
          </div>
        </div>
      </div>
    </>
  );
}
