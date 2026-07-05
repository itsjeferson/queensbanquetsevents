import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import InvitationRenderer from '../../components/invitation/InvitationRenderer';
import { invitationService } from '../../services/invitationService';
import {
  buildInvitationPreviewData,
  getLocalInvitationDraft,
  INVITATION_DRAFT_UPDATED_EVENT,
  isInvitationDraftStorageKey,
  mergeInvitationPayloadWithDraft,
} from '../../utils/invitationPreview';
import { applyInvitationPageMeta, resetInvitationPageMeta } from '../../utils/invitationPageMeta';
import { isSaveTheDateActive } from '../../utils/invitationContent';
import { hasRsvpUnlocked } from '../../utils/rsvpUnlock';
import Loader from '../../components/common/Loader/Loader';
import '../../styles/invitation.css';

function isSaveTheDatePath(pathname = '') {
  return pathname.includes('/savethedate/');
}

export default function PublicInvitation() {
  const { slug, code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOwnerPreview = searchParams.get('guest') === '1';
  const isSaveTheDateRoute = isSaveTheDatePath(location.pathname);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const lookupByCode = Boolean(code && !slug);
  const identifier = slug || code;
  const routeIdentifier = lookupByCode ? identifier?.toUpperCase() : identifier;

  const draftKey = useMemo(() => {
    if (!identifier) return null;
    return lookupByCode ? identifier.toUpperCase() : identifier;
  }, [identifier, lookupByCode]);

  const loadInvitation = useCallback(async ({ showLoading = false } = {}) => {
    if (!identifier) return;
    if (showLoading) setLoading(true);

    const draft = isOwnerPreview ? getLocalInvitationDraft(draftKey) : null;

    const applyPayload = (payload) => {
      const merged = draft ? mergeInvitationPayloadWithDraft(payload, draft) : payload;
      setData(buildInvitationPreviewData(merged));
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
  }, [draftKey, identifier, isOwnerPreview, lookupByCode]);

  const routeDecision = useMemo(() => {
    if (lookupByCode) return 'ready';

    const unlockLookup = data?.event
      ? {
        ...data.event,
        routeIdentifier,
        slug: data.event.slug || slug,
      }
      : { routeIdentifier, slug: identifier };

    const unlocked = isOwnerPreview
      ? false
      : hasRsvpUnlocked(unlockLookup);

    if (loading || !data?.event) {
      if (unlocked && isSaveTheDateRoute && !isOwnerPreview) return 'to-invite';
      return 'ready';
    }

    const saveTheDateActive = isSaveTheDateActive(data.invitation);

    if (!saveTheDateActive && isSaveTheDateRoute && !isOwnerPreview) return 'to-invite';
    if (saveTheDateActive && unlocked && isSaveTheDateRoute && !isOwnerPreview) return 'to-invite';
    if (saveTheDateActive && !unlocked && !isSaveTheDateRoute) return 'to-std';
    return 'ready';
  }, [
    data,
    identifier,
    isOwnerPreview,
    isSaveTheDateRoute,
    loading,
    lookupByCode,
    routeIdentifier,
    slug,
  ]);

  useEffect(() => {
    if (routeDecision === 'ready' || !data?.event) return;

    const eventSlug = data.event.slug || slug;
    const search = location.search || '';

    if (routeDecision === 'to-invite') {
      navigate(`/invite/${encodeURIComponent(eventSlug)}${search}`, { replace: true });
      return;
    }

    if (routeDecision === 'to-std') {
      navigate(`/savethedate/${encodeURIComponent(eventSlug)}${search}`, { replace: true });
    }
  }, [data?.event, location.search, navigate, routeDecision, slug]);

  useEffect(() => {
    loadInvitation({ showLoading: true });
    return () => resetInvitationPageMeta();
  }, [loadInvitation]);

  useEffect(() => {
    if (!data?.event || !data?.invitation) return;
    applyInvitationPageMeta({ event: data.event, invitation: data.invitation });
  }, [data]);

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

  const handleGuestUnlock = useCallback(() => {
    const eventSlug = data?.event?.slug || slug;
    if (!eventSlug) return;
    navigate(`/invite/${encodeURIComponent(eventSlug)}${location.search || ''}`, { replace: true });
  }, [data?.event?.slug, location.search, navigate, slug]);

  if (loading) {
    return <Loader variant="invitation" label="Loading invitation..." />;
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Invitation Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>This invitation may have been removed or is not yet published.</p>
      </div>
    );
  }

  return (
    <InvitationRenderer
      data={data}
      routeIdentifier={routeIdentifier}
      forceSaveTheDateStage={isSaveTheDateRoute && isSaveTheDateActive(data.invitation)}
      previewMode={isOwnerPreview}
      onGuestUnlock={handleGuestUnlock}
    />
  );
}
