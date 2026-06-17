import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvitationRenderer from '../../components/invitation/InvitationRenderer';
import { invitationService } from '../../services/invitationService';
import { buildInvitationPreviewData, getLocalInvitationDraft } from '../../utils/invitationPreview';
import '../../styles/invitation.css';

export default function PublicInvitation() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const draft = getLocalInvitationDraft(slug);
      if (draft) {
        setData(buildInvitationPreviewData(draft));
        setLoading(false);
        return;
      }

      try {
        const res = await invitationService.getPreviewBySlug(slug);
        setData(buildInvitationPreviewData(res.data));
      } catch {
        try {
          const res = await invitationService.getBySlug(slug);
          setData(buildInvitationPreviewData(res.data));
        } catch {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

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
