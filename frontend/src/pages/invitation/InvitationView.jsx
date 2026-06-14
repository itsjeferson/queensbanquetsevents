import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvitationRenderer from '../../components/invitation/InvitationRenderer';
import { invitationService } from '../../services/invitationService';
import { demoWeddingInvitation, demoDebutInvitation, demoBirthdayInvitation } from '../../data/demoInvitation';
import '../../styles/invitation.css';

const DEMO_MAP = {
  'john-jane': demoWeddingInvitation,
  'maria-at-18': demoDebutInvitation,
  'josh-7th-birthday': demoBirthdayInvitation,
};

export default function InvitationView({ mode = 'slug' }) {
  const params = useParams();
  const identifier = mode === 'code' ? params.code : params.slug;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = mode === 'code'
          ? await invitationService.getByCode(identifier)
          : await invitationService.getBySlug(identifier);
        setData(res.data);
      } catch {
        const demo = DEMO_MAP[identifier] || demoWeddingInvitation;
        setData(demo);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [identifier, mode]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading invitation...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Invitation Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>This invitation may have been removed or is not yet published.</p>
      </div>
    );
  }

  return <InvitationRenderer data={data} />;
}
