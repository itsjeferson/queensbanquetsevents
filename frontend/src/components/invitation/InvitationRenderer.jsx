import { useEffect, useRef, useState } from 'react';
import CoverScreen from './CoverScreen';
import Countdown from './Countdown';
import OpenedHeroSection from './OpenedHeroSection';
import QuoteBlock from './QuoteBlock';
import CoupleInitialsSection from './CoupleInitialsSection';
import StoryIntroSection from './StoryIntroSection';
import CoupleShowcaseSection from './CoupleShowcaseSection';
import WeddingDetailsSection from './WeddingDetailsSection';
import EntourageFullSection from './EntourageFullSection';
import AttireGuideSection from './AttireGuideSection';
import TimelineSection from './TimelineSection';
import GiftRegistry from './GiftRegistry';
import FaqSection from './FaqSection';
import HappyMomentsSlideshow from './HappyMomentsSlideshow';
import RSVPForm from './RSVPForm';
import GuestBook from './GuestBook';
import QRShare from './QRShare';
import InvitationFooter from './InvitationFooter';
import SaveTheDateScreen from './SaveTheDateScreen';
import RevealSection from './RevealSection';
import FloralCornerFrame from './FloralCornerFrame';
import { FloralThemeProvider } from './FloralThemeContext';
import { normalizeInvitationContent, getCoupleDisplayName } from '../../utils/invitationContent';
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

function SectionWrap({ gradual, children, className = '' }) {
  if (!gradual) return children;
  return <RevealSection enabled className={className}>{children}</RevealSection>;
}

function FloralSection({ gradual, children }) {
  return (
    <SectionWrap gradual={gradual}>
      <FloralCornerFrame className="inv-floral-frame-section">
        {children}
      </FloralCornerFrame>
    </SectionWrap>
  );
}

export default function InvitationRenderer({ data, resetRsvpUnlock = false }) {
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

  const [rsvpUnlocked, setRsvpUnlockedState] = useState(() => {
    if (resetRsvpUnlock && saveTheDateEnabled) return false;
    return isRsvpUnlocked(event, saveTheDateEnabled);
  });
  const [opened, setOpened] = useState(() => {
    if (resetRsvpUnlock && saveTheDateEnabled) return false;
    return saveTheDateEnabled && isRsvpUnlocked(event, saveTheDateEnabled);
  });
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (resetRsvpUnlock && saveTheDateEnabled) {
      clearRsvpUnlock(event);
      setRsvpUnlockedState(false);
      setOpened(false);
      return;
    }

    const unlocked = isRsvpUnlocked(event, saveTheDateEnabled);
    setRsvpUnlockedState(unlocked);
    if (saveTheDateEnabled && unlocked) setOpened(true);
  }, [event?.slug, event?.id, event?.invite_code, saveTheDateEnabled, resetRsvpUnlock]);

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
    setRsvpUnlocked(event, { name, attendance });
    setRsvpUnlockedState(true);
    setOpened(true);
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
      <style>{themeCss}</style>
      <div
        className="invitation-page"
        data-inv-theme={themeId}
        data-reveal-mode={gradualReveal ? 'gradual' : 'full'}
        style={themeStyles}
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
          <main id="inv-main" className="inv-main">
            <SectionWrap gradual={gradualReveal}>
              <OpenedHeroSection event={event} invitation={invitation} animateHero={!gradualReveal} />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <QuoteBlock quote={invitation.quote} source={invitation.quote_source} compact />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <StoryIntroSection story={invitation.story} showMessages={false} />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <QuoteBlock quote={invitation.secondary_quote} compact />
            </SectionWrap>

            <FloralSection gradual={gradualReveal}>
              <CoupleInitialsSection event={event} invitation={invitation} />
            </FloralSection>

            <FloralSection gradual={gradualReveal}>
              <StoryIntroSection
                showTitleImage={false}
                invitationMessage={invitation.story.invitation_message || invitation.invitation_message}
                acceptanceMessage={invitation.story.acceptance_message || invitation.acceptance_message}
              />
            </FloralSection>

            <FloralSection gradual={gradualReveal}>
              <CoupleShowcaseSection groom={invitation.groom_profile} bride={invitation.bride_profile} />
            </FloralSection>

            <SectionWrap gradual={gradualReveal}>
              <WeddingDetailsSection event={event} venue={invitation.venue} />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <section className="inv-countdown-band" id="countdown">
                {invitation.gallery?.[2]?.image && <img src={invitation.gallery[2].image} alt="" />}
                <div className="inv-countdown-overlay">
                  <p>The Countdown</p>
                  <Countdown eventDate={event.event_date} />
                </div>
              </section>
            </SectionWrap>

            {!saveTheDateEnabled && (
              <FloralSection gradual={gradualReveal}>
                <RSVPForm eventId={event.id} note={invitation.rsvp_note} />
              </FloralSection>
            )}

            <FloralSection gradual={gradualReveal}>
              <EntourageFullSection entourage={invitation.entourage} />
            </FloralSection>

            <FloralSection gradual={gradualReveal}>
              <AttireGuideSection
                attire={invitation.attire}
                dressCode={invitation.dress_code}
                invitation={invitation}
              />
            </FloralSection>

            <FloralSection gradual={gradualReveal}>
              <TimelineSection program={invitation.program} />
            </FloralSection>

            <SectionWrap gradual={gradualReveal}>
              <GiftRegistry registry={invitation.gift_registry} />
            </SectionWrap>

            <FloralSection gradual={gradualReveal}>
              <FaqSection faqs={invitation.faqs} />
            </FloralSection>

            <SectionWrap gradual={gradualReveal}>
              <HappyMomentsSlideshow gallery={invitation.gallery} />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <GuestBook eventId={event.id} messages={guestMessages} />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
            </SectionWrap>

            <SectionWrap gradual={gradualReveal}>
              <InvitationFooter eventName={coupleName} shareUrl={shareUrl} />
            </SectionWrap>
          </main>
        )}
        </FloralThemeProvider>
      </div>
    </>
  );
}
