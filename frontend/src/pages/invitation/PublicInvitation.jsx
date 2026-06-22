import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import InvitationRenderer from '../../components/invitation/InvitationRenderer';
import { invitationService } from '../../services/invitationService';
import {
  buildInvitationPreviewData,
  getLocalInvitationDraft,
  INVITATION_DRAFT_UPDATED_EVENT,
  isInvitationDraftStorageKey,
  mergeInvitationPayloadWithDraft,
} from '../../utils/invitationPreview';
import '../../styles/invitation.css';

export default function PublicInvitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const resetRsvpUnlock = searchParams.get('reset') === '1';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInvitation = useCallback(async ({ showLoading = false } = {}) => {
    if (!slug) return;
    if (showLoading) setLoading(true);

    const draft = getLocalInvitationDraft(slug);

    try {
      const res = await invitationService.getPreviewBySlug(slug);
      setData(buildInvitationPreviewData(mergeInvitationPayloadWithDraft(res.data, draft)));
      return;
    } catch {
      try {
        const res = await invitationService.getBySlug(slug);
        setData(buildInvitationPreviewData(mergeInvitationPayloadWithDraft(res.data, draft)));
        return;
      } catch {
        if (draft) {
          setData(buildInvitationPreviewData(draft));
          return;
        }
        setData(null);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadInvitation({ showLoading: true });
  }, [loadInvitation]);

  useEffect(() => {
    if (!slug) return undefined;

    const matchesSlug = (detail) => detail?.slug === slug;

    const onDraftUpdated = (event) => {
      if (matchesSlug(event.detail)) {
        loadInvitation();
      }
    };

    const onStorage = (event) => {
      if (isInvitationDraftStorageKey(event.key, slug)) {
        loadInvitation();
      }
    };

    window.addEventListener(INVITATION_DRAFT_UPDATED_EVENT, onDraftUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(INVITATION_DRAFT_UPDATED_EVENT, onDraftUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadInvitation, slug]);

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

  return <InvitationRenderer data={data} resetRsvpUnlock={resetRsvpUnlock} />;
}
