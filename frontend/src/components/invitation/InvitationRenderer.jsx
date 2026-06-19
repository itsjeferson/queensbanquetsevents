import { useRef, useState } from 'react';
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
import { normalizeInvitationContent } from '../../utils/invitationContent';
import {
  buildInvitationThemeCss,
  extractInvitationThemeInput,
  getInvitationThemeStyles,
} from '../../utils/invitationTheme';
import '../../styles/invitation.css';

const TYPE_LABELS = {
  wedding: { together: 'Together With Their Families', invite: 'Invite You To Celebrate Their Wedding' },
  debut: { together: 'Together With Her Family', invite: 'Invite You To Her Debut Celebration' },
  birthday: { together: 'You Are Cordially Invited', invite: 'Join Us For A Birthday Celebration' },
  anniversary: { together: 'Together Through The Years', invite: 'Invite You To Celebrate Their Anniversary' },
  corporate: { together: 'You Are Invited', invite: 'Join Us For This Special Event' },
};

export default function InvitationRenderer({ data }) {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const { event, invitation: rawInvitation = {}, guest_messages: guestMessages } = data;
  const themeInput = extractInvitationThemeInput(rawInvitation);
  const invitation = normalizeInvitationContent({ ...rawInvitation, ...themeInput });
  const labels = TYPE_LABELS[event.event_type] || TYPE_LABELS.wedding;
  const shareUrl = window.location.href;
  const themedInvitation = { ...invitation, ...themeInput };
  const themeStyles = getInvitationThemeStyles(themedInvitation);
  const themeCss = buildInvitationThemeCss(themedInvitation);
  const themeId = themeInput.color_motif || 'classic-gold';

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

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  };

  return (
    <>
      <style>{themeCss}</style>
      <div
        className="invitation-page"
        data-inv-theme={themeId}
        style={themeStyles}
      >
      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop preload="auto" playsInline />
      )}
      {invitation.music_url && opened && (
        <button type="button" className="inv-music-toggle" onClick={toggleMusic}>
          {musicOn ? 'Pause Music' : 'Play Music'}
        </button>
      )}

      <CoverScreen event={event} invitation={invitation} onOpen={scrollToContent} labels={labels} />

      {opened && (
        <main id="inv-main" className="inv-main">
          <OpenedHeroSection event={event} invitation={invitation} />

          <QuoteBlock quote={invitation.quote} source={invitation.quote_source} compact />

          <StoryIntroSection story={invitation.story} showMessages={false} />

          <QuoteBlock quote={invitation.secondary_quote} compact />

          <CoupleInitialsSection event={event} invitation={invitation} />

          <StoryIntroSection
            showTitleImage={false}
            invitationMessage={invitation.story.invitation_message || invitation.invitation_message}
            acceptanceMessage={invitation.story.acceptance_message || invitation.acceptance_message}
          />

          <CoupleShowcaseSection groom={invitation.groom_profile} bride={invitation.bride_profile} />

          <WeddingDetailsSection event={event} venue={invitation.venue} />

          <section className="inv-countdown-band" id="countdown">
            {invitation.gallery?.[2]?.image && <img src={invitation.gallery[2].image} alt="" />}
            <div className="inv-countdown-overlay">
              <p>The Countdown</p>
              <Countdown eventDate={event.event_date} />
            </div>
          </section>

          <RSVPForm eventId={event.id} note={invitation.rsvp_note} />

          <EntourageFullSection entourage={invitation.entourage} />

          <AttireGuideSection attire={invitation.attire} dressCode={invitation.dress_code} />

          <TimelineSection program={invitation.program} />

          <GiftRegistry registry={invitation.gift_registry} />

          <FaqSection faqs={invitation.faqs} />

          <HappyMomentsSlideshow gallery={invitation.gallery} />

          <GuestBook eventId={event.id} messages={guestMessages} />

          <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
          <InvitationFooter eventName={event.event_name} shareUrl={shareUrl} />
        </main>
      )}
      </div>
    </>
  );
}
