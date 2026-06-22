import { useEffect, useMemo, useRef, useState } from 'react';
import CoverScreen from './CoverScreen';
import SaveTheDateScreen from './SaveTheDateScreen';
import InvitationMainContent from './InvitationMainContent';
import { FloralThemeProvider } from './FloralThemeContext';
import { normalizeInvitationContent, getCoupleDisplayName } from '../../utils/invitationContent';
import {
  getVisibleContentRevealOrder,
} from '../../utils/contentReveal';
import {
  buildInvitationThemeCss,
  extractInvitationThemeInput,
  getFloralThemeColors,
  getInvitationPaletteColors,
  getInvitationThemeStyles,
  resolveInvitationThemeFields,
} from '../../utils/invitationTheme';
import { hasRsvpUnlocked, setRsvpUnlocked, clearRsvpUnlock } from '../../utils/rsvpUnlock';
import { getInvitationShareUrl } from '../../utils/invitationShare';
import '../../styles/invitation.css';

const TYPE_LABELS = {
  wedding: { together: 'Together With Their Families', invite: 'Invite You To Celebrate Their Wedding' },
  debut: { together: 'Together With Her Family', invite: 'Invite You To Her Debut Celebration' },
  birthday: { together: 'You Are Cordially Invited', invite: 'Join Us For A Birthday Celebration' },
  anniversary: { together: 'Together Through The Years', invite: 'Invite You To Celebrate Their Anniversary' },
  corporate: { together: 'You Are Invited', invite: 'Join Us For This Special Event' },
};

function isRsvpUnlocked(event, saveTheDateEnabled) {
  if (!saveTheDateEnabled) return true;
  return hasRsvpUnlocked(event);
}

export default function InvitationRenderer({
  data,
  resetRsvpUnlock = false,
  routeIdentifier = '',
  onRsvpUnlock,
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
  const shareUrl = getInvitationShareUrl({
    slug: event?.slug,
    inviteCode: event?.invite_code,
    guestPreview: true,
  });
  const themeStyles = getInvitationThemeStyles(themedInvitation);
  const floralTheme = getFloralThemeColors(themedInvitation);
  const themeCss = buildInvitationThemeCss(themedInvitation);
  const themeId = themeInput.color_motif || 'classic-gold';

  const saveTheDateEnabled = Boolean(invitation.save_the_date_enabled);
  const gradualReveal = invitation.content_reveal_mode === 'gradual';
  const revealOptions = { hideRsvp: saveTheDateEnabled };
  const sectionOrder = getVisibleContentRevealOrder(invitation.content_reveal_order, revealOptions);
  const unlockContext = useMemo(
    () => (routeIdentifier ? { ...event, routeIdentifier } : event),
    [event, routeIdentifier],
  );

  const [rsvpUnlocked, setRsvpUnlockedState] = useState(() => {
    if (resetRsvpUnlock && saveTheDateEnabled) return false;
    return isRsvpUnlocked(unlockContext, saveTheDateEnabled);
  });
  const [opened, setOpened] = useState(() => {
    if (resetRsvpUnlock && saveTheDateEnabled) return false;
    return saveTheDateEnabled && isRsvpUnlocked(unlockContext, saveTheDateEnabled);
  });
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (resetRsvpUnlock && saveTheDateEnabled) {
      clearRsvpUnlock(unlockContext);
      setRsvpUnlockedState(false);
      setOpened(false);
      return;
    }

    const unlocked = isRsvpUnlocked(unlockContext, saveTheDateEnabled);
    setRsvpUnlockedState(unlocked);
    if (saveTheDateEnabled && unlocked) setOpened(true);
  }, [event?.slug, event?.id, event?.invite_code, routeIdentifier, saveTheDateEnabled, resetRsvpUnlock]);

  const startMusic = () => {
    if (!invitation.music_url || !audioRef.current) return;
    audioRef.current.volume = 0.45;
    audioRef.current.play()
      .then(() => setMusicOn(true))
      .catch(() => setMusicOn(false));
  };

  const scrollToContent = () => {
    setOpened(true);
    startMusic();
    setTimeout(() => document.getElementById('inv-main')?.scrollIntoView({ behavior: 'smooth' }), 120);
  };

  const handleSaveTheDateRsvp = ({ name, attendance }) => {
    setRsvpUnlocked(unlockContext, { name, attendance });
    setRsvpUnlockedState(true);
    setOpened(true);
    onRsvpUnlock?.();
    startMusic();
    setTimeout(() => document.getElementById('inv-main')?.scrollIntoView({ behavior: 'smooth' }), 200);
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

  const showSaveTheDate = saveTheDateEnabled && !rsvpUnlocked;
  const showCover = !showSaveTheDate && !opened;
  const showInvitation = opened && !showSaveTheDate;

  return (
    <>
      {!showSaveTheDate && <style>{themeCss}</style>}
      <div
        className="invitation-page"
        data-inv-theme={showSaveTheDate ? undefined : themeId}
        data-guest-stage={showSaveTheDate ? 'save-the-date' : 'invitation'}
        data-reveal-mode={gradualReveal ? 'gradual' : 'full'}
        style={showSaveTheDate ? undefined : themeStyles}
      >
        <FloralThemeProvider value={floralTheme}>
        {invitation.music_url && (
          <audio ref={audioRef} src={invitation.music_url} loop preload="auto" playsInline />
        )}
        {invitation.music_url && opened && (
          <button type="button" className="inv-music-toggle" onClick={toggleMusic}>
            {musicOn ? 'Pause Music' : 'Play Music'}
          </button>
        )}

        {showSaveTheDate && (
          <SaveTheDateScreen
            event={event}
            invitation={invitation}
            onRsvpSuccess={handleSaveTheDateRsvp}
          />
        )}

        {showCover && (
          <CoverScreen event={event} invitation={invitation} onOpen={scrollToContent} labels={labels} />
        )}

        {showInvitation && (
          <InvitationMainContent
            event={event}
            invitation={invitation}
            coupleName={coupleName}
            shareUrl={shareUrl}
            guestMessages={guestMessages}
            saveTheDateEnabled={saveTheDateEnabled}
            sectionOrder={sectionOrder}
            gradualReveal={gradualReveal}
          />
        )}
        </FloralThemeProvider>
      </div>
    </>
  );
}
