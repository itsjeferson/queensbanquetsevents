import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import InvitationRenderer from '../../components/invitation/InvitationRenderer';
import { invitationService, rsvpService } from '../../services/invitationService';
import {
  buildInvitationPreviewData,
  getLocalInvitationDraft,
  INVITATION_DRAFT_UPDATED_EVENT,
  isInvitationDraftStorageKey,
  mergeInvitationPayloadWithDraft,
} from '../../utils/invitationPreview';
import { applyInvitationPageMeta, resetInvitationPageMeta } from '../../utils/invitationPageMeta';
import { isSaveTheDateActive } from '../../utils/invitationContent';
import {
  clearRsvpUnlock,
  getRsvpUnlockRecord,
  hasRsvpUnlocked,
} from '../../utils/rsvpUnlock';
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
  const isRsvpRoute = location.pathname.endsWith('/rsvp');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [unlockValidated, setUnlockValidated] = useState(undefined);

  useEffect(() => {
    setTransitionLoading(true);
    const timer = setTimeout(() => {
      setTransitionLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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

    const draft = getLocalInvitationDraft(draftKey);

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

  const unlockLookup = useMemo(
    () => (data?.event
      ? { ...data.event, routeIdentifier, slug: data.event.slug || slug }
      : { routeIdentifier, slug: identifier }),
    [data?.event, identifier, routeIdentifier, slug],
  );

  const routeDecision = useMemo(() => {
    if (lookupByCode) return 'ready';

    const unlocked = isOwnerPreview
      ? false
      : unlockValidated === true && hasRsvpUnlocked(unlockLookup);

    if (loading || !data?.event) {
      if (unlocked && isSaveTheDateRoute && !isOwnerPreview) return 'to-invite';
      return 'ready';
    }

    const saveTheDateActive = isSaveTheDateActive(data.invitation);

    if (!saveTheDateActive && isSaveTheDateRoute) return 'to-invite';
    if (saveTheDateActive && unlocked && isSaveTheDateRoute && !isOwnerPreview && !isRsvpRoute) return 'to-invite';
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
    unlockLookup,
    unlockValidated,
  ]);

  const needsUnlockCheck = useMemo(() => {
    if (isOwnerPreview || lookupByCode || !data?.event || !data?.invitation) return false;
    if (!isSaveTheDateActive(data.invitation)) return false;
    return Boolean(getRsvpUnlockRecord(unlockLookup)?.name);
  }, [data?.event, data?.invitation, isOwnerPreview, lookupByCode, unlockLookup]);

  const verificationPending = needsUnlockCheck && unlockValidated === undefined;

  useEffect(() => {
    if (!needsUnlockCheck) {
      setUnlockValidated(true);
      return;
    }
    const record = getRsvpUnlockRecord(unlockLookup);
    if (!record?.name || !data?.event?.id) {
      setUnlockValidated(true);
      return;
    }

    let cancelled = false;
    setUnlockValidated(undefined);
    rsvpService.verifyRsvpExists(data.event.id, record.name)
      .then((res) => {
        if (cancelled) return;
        if (res?.success && res.data?.exists === false) {
          clearRsvpUnlock(unlockLookup);
          setUnlockValidated(false);
        } else {
          setUnlockValidated(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUnlockValidated(true);
      });
    return () => { cancelled = true; };
  }, [data?.event?.id, needsUnlockCheck, unlockLookup]);

  useEffect(() => {
    if (verificationPending || routeDecision === 'ready' || !data?.event) return;

    const eventSlug = data.event.slug || slug;
    const search = location.search || '';

    if (routeDecision === 'to-invite') {
      navigate(`/invite/${encodeURIComponent(eventSlug)}${search}`, { replace: true });
      return;
    }

    if (routeDecision === 'to-std') {
      navigate(`/savethedate/${encodeURIComponent(eventSlug)}${search}`, { replace: true });
    }
  }, [data?.event, location.search, navigate, routeDecision, slug, verificationPending]);

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
    setUnlockValidated(true);
    navigate(`/invite/${encodeURIComponent(eventSlug)}${location.search || ''}`, { replace: true });
  }, [data?.event?.slug, location.search, navigate, slug]);

  if (loading || transitionLoading || verificationPending) {
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
      rsvpForceForm={isRsvpRoute}
      previewMode={isOwnerPreview}
      forceRsvpGate={unlockValidated !== true}
      onGuestUnlock={handleGuestUnlock}
    />
  );
}
