import Countdown from './Countdown';
import OpenedHeroSection from './OpenedHeroSection';
import QuoteBlock from './QuoteBlock';
import CoupleInitialsSection from './CoupleInitialsSection';
import StoryIntroSection from './StoryIntroSection';
import CoupleShowcaseSection from './CoupleShowcaseSection';
import WeddingDetailsSection from './WeddingDetailsSection';
import EntourageFullSection from './EntourageFullSection';
import AttireGuideSection from './AttireGuideSection';
import ColorGuideSection from './ColorGuideSection';
import TimelineSection from './TimelineSection';
import GiftRegistry from './GiftRegistry';
import FaqSection from './FaqSection';
import HappyMomentsSlideshow from './HappyMomentsSlideshow';
import RSVPForm from './RSVPForm';
import GuestBook from './GuestBook';
import QRShare from './QRShare';
import InvitationFooter from './InvitationFooter';
import FloralCornerFrame from './FloralCornerFrame';
import MusicPlayerCard from './MusicPlayerCard';
import WeddingMonthCalendar from './WeddingMonthCalendar';
import ScrollToTopButton from '../common/ScrollToTop/ScrollToTopButton';
import { parseEventDate } from '../../utils/eventDate';
import { isDirectVideoUrl, resolveMediaUrl } from '../../utils/mediaUrl';

function SectionShell({
  sectionId,
  floral,
  children,
}) {
  const content = floral ? (
    <FloralCornerFrame className="inv-floral-frame-section">{children}</FloralCornerFrame>
  ) : children;

  return (
    <div
      className={`inv-section-shell inv-section-${sectionId}`}
      data-section-id={sectionId}
    >
      {content}
    </div>
  );
}

export function renderInvitationSection(sectionId, ctx) {
  const {
    event,
    invitation,
    coupleName,
    shareUrl,
    guestMessages,
    saveTheDateEnabled,
    musicOn,
    toggleMusic,
  } = ctx;

  switch (sectionId) {
    case 'hero':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <OpenedHeroSection event={event} invitation={invitation} animateHero />
        </SectionShell>
      );
    case 'quote_primary':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <QuoteBlock quote={invitation.quote} source={invitation.quote_source} compact />
          {!invitation.hide_music_player && (
            <MusicPlayerCard musicOn={musicOn} toggleMusic={toggleMusic} />
          )}
        </SectionShell>
      );
    case 'story_intro':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <StoryIntroSection story={invitation.story} showMessages={false} />
        </SectionShell>
      );
    case 'quote_secondary':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <QuoteBlock quote={invitation.secondary_quote} compact />
        </SectionShell>
      );
    case 'couple_initials':
      return (
        <SectionShell sectionId={sectionId} floral>
          <CoupleInitialsSection event={event} invitation={invitation} />
        </SectionShell>
      );
    case 'invitation_message':
      return (
        <SectionShell sectionId={sectionId} floral>
          <StoryIntroSection
            showTitleImage={false}
            invitationMessage={invitation.story.invitation_message || invitation.invitation_message}
            acceptanceMessage={invitation.story.acceptance_message || invitation.acceptance_message}
          />
        </SectionShell>
      );
    case 'couple_showcase':
      return (
        <SectionShell sectionId={sectionId} floral>
          <CoupleShowcaseSection groom={invitation.groom_profile} bride={invitation.bride_profile} />
        </SectionShell>
      );
    case 'wedding_details':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <WeddingDetailsSection event={event} venue={invitation.venue} />
        </SectionShell>
      );
    case 'countdown':
      const countdownMedia = resolveMediaUrl(
        invitation.countdown_bg_media ||
        invitation.countdown_media ||
        invitation.opening_hero_image ||
        invitation.cover_image ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80'
      );
      const isVideoMedia = Boolean(countdownMedia) && isDirectVideoUrl(countdownMedia);
      const countdownTitle = invitation.countdown_title?.trim() || "Countdown to forever:";

      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <section className="inv-countdown-band-media" id="countdown">
            {isVideoMedia ? (
              <video src={countdownMedia} autoPlay muted loop playsInline className="inv-countdown-media-bg" />
            ) : (
              <img src={countdownMedia} alt="" className="inv-countdown-media-bg" />
            )}
            <div className="inv-countdown-media-overlay" />
            <div className="inv-countdown-media-content">
              <h3 className="inv-countdown-script-title">{countdownTitle}</h3>
              <Countdown eventDate={event.event_date} />
            </div>
          </section>
        </SectionShell>
      );
    case 'rsvp':
      if (saveTheDateEnabled || invitation.save_the_date_enabled || invitation.hide_rsvp) return null;
      return (
        <SectionShell sectionId={sectionId} floral>
          <RSVPForm eventId={event.id} note={invitation.rsvp_note} />
        </SectionShell>
      );
    case 'entourage':
      return (
        <SectionShell sectionId={sectionId} floral>
          <EntourageFullSection entourage={invitation.entourage} />
        </SectionShell>
      );
    case 'attire':
      return (
        <SectionShell sectionId={sectionId} floral>
          <AttireGuideSection
            attire={invitation.attire}
            dressCode={invitation.dress_code}
            invitation={invitation}
          />
        </SectionShell>
      );
    case 'color_guide':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <ColorGuideSection colorGuide={invitation.color_guide} image={invitation.color_guide_image} />
        </SectionShell>
      );
    case 'program':
      return (
        <SectionShell sectionId={sectionId} floral>
          <TimelineSection program={invitation.program} coupleName={coupleName} />
        </SectionShell>
      );
    case 'gift_registry':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <GiftRegistry registry={invitation.gift_registry} />
        </SectionShell>
      );
    case 'faqs':
      return (
        <SectionShell sectionId={sectionId} floral>
          <FaqSection faqs={invitation.faqs} />
        </SectionShell>
      );
    case 'gallery':
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <HappyMomentsSlideshow gallery={invitation.gallery} />
        </SectionShell>
      );
    case 'guest_book':
      return (
        <SectionShell sectionId={sectionId} floral>
          <GuestBook eventId={event.id} messages={guestMessages} />
        </SectionShell>
      );
    case 'qr_share':
      if (invitation.hide_qr_share || invitation.qr_enabled === false || invitation.qr_enabled === 0 || invitation.qr_enabled === '0' || invitation.qr_enabled === 'false') {
        return null;
      }
      return (
        <SectionShell sectionId={sectionId} floral={false}>
          <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
        </SectionShell>
      );
    case 'footer':
      if (invitation.hide_footer) return null;
      return (
        <InvitationFooter
          eventName={coupleName}
          shareUrl={shareUrl}
          hideShareButton={invitation.hide_share_button}
          hideRsvpButton={invitation.hide_rsvp_button || invitation.hide_rsvp}
          hideFooter={invitation.hide_footer}
        />
      );
    default:
      return null;
  }
}

export default function InvitationMainContent({
  event,
  invitation,
  coupleName,
  shareUrl,
  guestMessages,
  saveTheDateEnabled,
  sectionOrder,
  musicOn,
  toggleMusic,
}) {
  const sectionCtx = {
    event,
    invitation,
    coupleName,
    shareUrl,
    guestMessages,
    saveTheDateEnabled,
    musicOn,
    toggleMusic,
  };

  return (
    <main id="inv-main" className="inv-main">
      {sectionOrder.map((sectionId) => {
        const section = renderInvitationSection(sectionId, sectionCtx);
        if (!section) return null;
        return <div key={sectionId}>{section}</div>;
      })}
      <ScrollToTopButton />
    </main>
  );
}
