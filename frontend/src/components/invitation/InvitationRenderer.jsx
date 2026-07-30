import { useEffect, useMemo, useRef, useState } from 'react';
import CoverScreen from './CoverScreen';
import SaveTheDateScreen from './SaveTheDateScreen';
import RsvpFormPage from './RsvpFormPage';
import PasswordGate from './PasswordGate';
import InvitationMainContent from './InvitationMainContent';
import RoyalLuxuryInvitation from './RoyalLuxuryInvitation';
import { FloralThemeProvider } from './FloralThemeContext';
import {
  normalizeInvitationContent,
  getCoupleDisplayName,
  isSaveTheDateActive,
  isFloralDesignEnabled,
  isPasswordProtected,
} from '../../utils/invitationContent';
import {
  getVisibleContentRevealOrder,
  resolveInvitationSectionOrder,
} from '../../utils/contentReveal';
import {
  buildInvitationThemeCss,
  extractInvitationThemeInput,
  getFloralThemeColors,
  getInvitationPaletteColors,
  getInvitationThemeStyles,
  resolveInvitationThemeFields,
} from '../../utils/invitationTheme';
import {
  hasRsvpUnlocked,
  hasInvitationOpened,
  setRsvpUnlocked,
  setInvitationOpened,
  consumeRsvpPreviewReset,
} from '../../utils/rsvpUnlock';
import { getInvitationShareUrl } from '../../utils/invitationShare';
import { isDirectAudioUrl, resolveMediaUrl } from '../../utils/mediaUrl';
import '../../styles/invitation.css';

const TYPE_LABELS = {
  wedding: { together: 'Together With Their Families', invite: 'Invite You To Celebrate Their Wedding' },
  debut: { together: 'Together With Her Family', invite: 'Invite You To Her Debut Celebration' },
  birthday: { together: 'You Are Cordially Invited', invite: 'Join Us For A Birthday Celebration' },
  anniversary: { together: 'Together Through The Years', invite: 'Invite You To Celebrate Their Anniversary' },
  corporate: { together: 'You Are Invited', invite: 'Join Us For This Special Event' },
};

export default function InvitationRenderer({
  data,
  routeIdentifier = '',
  forceSaveTheDateStage = false,
  rsvpForceForm = false,
  previewMode = false,
  onGuestUnlock,
}) {
  const { event, invitation: rawInvitation = {}, guest_messages: guestMessages } = data;
  const themeInput = extractInvitationThemeInput(rawInvitation);
  const invitation = normalizeInvitationContent({ ...rawInvitation, ...themeInput });
  const palette = getInvitationPaletteColors(invitation);
  const themedInvitation = {
    ...invitation,
    ...resolveInvitationThemeFields({
      ...invitation,
      palette_colors: palette,
      primary_color: palette[0],
      background_color: palette[1],
      secondary_color: palette[2],
    }),
    palette_colors: palette,
  };
  const labels = TYPE_LABELS[event.event_type] || TYPE_LABELS.wedding;
  const coupleName = getCoupleDisplayName(event, invitation);
  const saveTheDateActive = isSaveTheDateActive(invitation);
  const shareUrl = getInvitationShareUrl({
    slug: event?.slug,
    inviteCode: event?.invite_code,
    saveTheDateEnabled: saveTheDateActive || forceSaveTheDateStage,
  });
  const themeStyles = getInvitationThemeStyles(themedInvitation);
  const floralTheme = {
    ...getFloralThemeColors(themedInvitation),
    enabled: isFloralDesignEnabled(invitation),
  };
  const themeCss = buildInvitationThemeCss(themedInvitation);
  const themeId = themeInput.color_motif || 'classic-gold';
  const gradualReveal = invitation.content_reveal_mode === 'gradual';

  const passwordProtected = isPasswordProtected(invitation, event);
  const [passwordUnlocked, setPasswordUnlocked] = useState(() => {
    if (!passwordProtected) return true;
    if (previewMode) return false;
    if (typeof window === 'undefined') return false;
    const slugKey = event?.slug || routeIdentifier;
    return localStorage.getItem('qb_pw_unlock_' + slugKey) === '1' ||
           sessionStorage.getItem('qb_pw_unlock_' + slugKey) === '1';
  });
  const revealOptions = { hideRsvp: saveTheDateActive };
  const sectionOrder = resolveInvitationSectionOrder(invitation, revealOptions);
  const unlockContext = useMemo(
    () => (routeIdentifier ? { ...event, routeIdentifier } : event),
    [event, routeIdentifier],
  );

  const [resetRsvpUnlock] = useState(() => (
    previewMode ? consumeRsvpPreviewReset(unlockContext) : false
  ));
  const skipStoredUnlock = previewMode || resetRsvpUnlock;
  const [previewSessionUnlocked, setPreviewSessionUnlocked] = useState(false);
  const storedUnlock = !skipStoredUnlock && saveTheDateActive && hasRsvpUnlocked(unlockContext);
  const storedOpened = storedUnlock && hasInvitationOpened(unlockContext);

  const [rsvpUnlocked, setRsvpUnlockedState] = useState(() => {
    if ((saveTheDateActive || forceSaveTheDateStage) && skipStoredUnlock) return false;
    if (!saveTheDateActive && !forceSaveTheDateStage) return false;
    return storedUnlock;
  });
  const [opened, setOpened] = useState(() => {
    if ((saveTheDateActive || forceSaveTheDateStage) && skipStoredUnlock) return false;
    return storedOpened;
  });
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const musicUrl = useMemo(() => {
    const stdActive = (saveTheDateActive || forceSaveTheDateStage) && !opened;
    const rawUrl = stdActive
      ? (invitation.std_music_url || invitation.music_url)
      : (invitation.music_url || invitation.std_music_url);
    const resolved = resolveMediaUrl(rawUrl);
    return resolved && isDirectAudioUrl(resolved) ? resolved : '';
  }, [invitation.music_url, invitation.std_music_url, saveTheDateActive, forceSaveTheDateStage, opened]);

  useEffect(() => {
    if (!saveTheDateActive && !forceSaveTheDateStage) {
      setRsvpUnlockedState(false);
      setOpened(false);
      return;
    }

    if (previewMode) {
      if (!previewSessionUnlocked) {
        setRsvpUnlockedState(false);
        setOpened(false);
      }
      return;
    }

    const unlocked = saveTheDateActive && hasRsvpUnlocked(unlockContext);
    setRsvpUnlockedState(unlocked);
    setOpened(unlocked && hasInvitationOpened(unlockContext));
  }, [
    event?.slug,
    event?.id,
    event?.invite_code,
    routeIdentifier,
    saveTheDateActive,
    forceSaveTheDateStage,
    previewMode,
    previewSessionUnlocked,
    resetRsvpUnlock,
    unlockContext,
  ]);

  const startMusic = () => {
    if (!musicUrl || !audioRef.current) return;
    audioRef.current.volume = 0.45;
    audioRef.current.play()
      .then(() => setMusicOn(true))
      .catch(() => setMusicOn(false));
  };

  const scrollToContent = () => {
    setOpened(true);
    if (!previewMode && saveTheDateActive) {
      setInvitationOpened(unlockContext);
    }
    startMusic();
    setTimeout(() => document.getElementById('inv-main')?.scrollIntoView({ behavior: 'smooth' }), 120);
  };

  const handleSaveTheDateRsvp = ({ name, attendance }) => {
    setRsvpUnlockedState(true);
    setOpened(false);

    if (previewMode) {
      setPreviewSessionUnlocked(true);
      return;
    }

    setRsvpUnlocked(unlockContext, { name, attendance });
    onGuestUnlock?.();
  };

  const handlePasswordUnlock = () => {
    setPasswordUnlocked(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('qb_pw_unlock_' + (event?.slug || routeIdentifier), '1');
      } catch {}
    }
    setTimeout(() => {
      startMusic();
    }, 150);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  };

  useEffect(() => {
    if (passwordUnlocked && musicUrl && !musicOn) {
      const handleUserInteraction = (e) => {
        if (e.target?.closest?.('.inv-floating-music-btn,.music-play-btn')) return;
        startMusic();
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
      };
      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);
      return () => {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [passwordUnlocked, musicUrl, musicOn]);

  const stdGateActive = saveTheDateActive || forceSaveTheDateStage;
  const showSaveTheDate = stdGateActive && !rsvpUnlocked;
  const showCover = !opened && !showSaveTheDate;
  
  const effectiveTemplateId = Number(invitation?.template_id) || 1;
  const isEnvelopeTemplate = effectiveTemplateId === 3;
  const showInvitation = (opened || isEnvelopeTemplate) && (!stdGateActive || rsvpUnlocked);

  useEffect(() => {
    document.documentElement.classList.add('invitation-scroll');
    return () => document.documentElement.classList.remove('invitation-scroll');
  }, []);

  return (
    <>
      <style>{themeCss}</style>
      <div
        className="invitation-page"
        data-inv-theme={themeId}
        data-guest-stage={showSaveTheDate ? 'save-the-date' : 'invitation'}
        data-reveal-mode={gradualReveal ? 'gradual' : 'full'}
        style={themeStyles}
      >
        <FloralThemeProvider value={floralTheme}>
        {musicUrl && (
          <audio ref={audioRef} src={musicUrl} loop preload="auto" playsInline />
        )}

        {passwordProtected && !passwordUnlocked ? (
          <PasswordGate event={event} invitation={invitation} onUnlocked={handlePasswordUnlock} />
        ) : (
          <>
            {showSaveTheDate && (
              rsvpForceForm ? (
                <RsvpFormPage
                  event={event}
                  invitation={themedInvitation}
                  onRsvpSuccess={handleSaveTheDateRsvp}
                />
              ) : (
                <SaveTheDateScreen
                  event={event}
                  invitation={themedInvitation}
                  rsvpForceForm={rsvpForceForm}
                  onRsvpSuccess={handleSaveTheDateRsvp}
                />
              )
            )}

            {showCover && (
              <CoverScreen event={event} invitation={invitation} onOpen={scrollToContent} labels={labels} />
            )}

            {showInvitation && (
              effectiveTemplateId === 3 ? (
                <RoyalLuxuryInvitation
                  event={event}
                  invitation={invitation}
                  guestMessages={guestMessages}
                  shareUrl={shareUrl}
                  saveTheDateEnabled={saveTheDateActive}
                />
              ) : (
                <InvitationMainContent
                  event={event}
                  invitation={invitation}
                  coupleName={coupleName}
                  shareUrl={shareUrl}
                  guestMessages={guestMessages}
                  saveTheDateEnabled={saveTheDateActive}
                  sectionOrder={sectionOrder}
                  gradualReveal={gradualReveal}
                  musicOn={musicOn}
                  toggleMusic={toggleMusic}
                />
              )
            )}
          </>
        )}
        {showInvitation && musicUrl && passwordUnlocked && invitation.hide_music_player && (
          <button
            type="button"
            className={`inv-floating-music-btn ${musicOn ? 'playing' : ''}`}
            onClick={toggleMusic}
            aria-label={musicOn ? "Pause Music" : "Play Music"}
            title={musicOn ? "Pause Music" : "Play Music"}
          >
            {musicOn ? '🎵' : '🔇'}
          </button>
        )}
        </FloralThemeProvider>
      </div>
    </>
  );
}
