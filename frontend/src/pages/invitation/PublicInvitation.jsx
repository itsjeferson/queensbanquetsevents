import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const { slug, code } = useParams();
  const [searchParams] = useSearchParams();
  const resetRsvpUnlock = searchParams.get('reset') === '1';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const lookupByCode = Boolean(code && !slug);
  const identifier = slug || code;

  const draftKey = useMemo(() => {
    if (!identifier) return null;
    return lookupByCode ? identifier.toUpperCase() : identifier;
  }, [identifier, lookupByCode]);

  const loadInvitation = useCallback(async ({ showLoading = false } = {}) => {
    if (!identifier) return;
    if (showLoading) setLoading(true);

    const draft = getLocalInvitationDraft(draftKey);

    const applyPayload = (payload) => {
      setData(buildInvitationPreviewData(mergeInvitationPayloadWithDraft(payload, draft)));
    };

    try {
      if (lookupByCode) {
        const res = await invitationService.getByCode(identifier);
        applyPayload(res.data);
        return;
      }

      try {
        const res = await invitationService.getPreviewBySlug(identifier);
        applyPayload(res.data);
        return;
      } catch {
        const res = await invitationService.getBySlug(identifier);
        applyPayload(res.data);
      }
    } catch {
      if (draft) {
        setData(buildInvitationPreviewData(draft));
        return;
      }
      setData(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [draftKey, identifier, lookupByCode]);

  useEffect(() => {
    loadInvitation({ showLoading: true });
  }, [loadInvitation]);

  useEffect(() => {
    if (!identifier || lookupByCode) return undefined;

    const onDraftUpdated = (event) => {
      if (event.detail?.slug === identifier) {
        loadInvitation();
      }
    };

    const onStorage = (event) => {
      if (isInvitationDraftStorageKey(event.key, identifier)) {
        loadInvitation();
      }
    };

    window.addEventListener(INVITATION_DRAFT_UPDATED_EVENT, onDraftUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(INVITATION_DRAFT_UPDATED_EVENT, onDraftUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, [identifier, loadInvitation, lookupByCode]);

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
