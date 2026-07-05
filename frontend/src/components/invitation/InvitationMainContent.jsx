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
import FloralCornerFrame from './FloralCornerFrame';
import { useEffect, useRef } from 'react';

function SectionShell({
  sectionId,
  floral,
  scrollAnimation,
  children,
}) {
  const shellRef = useRef(null);
  const content = floral ? (
    <FloralCornerFrame className="inv-floral-frame-section">{children}</FloralCornerFrame>
  ) : children;

  useEffect(() => {
    if (!scrollAnimation) return undefined;

    const node = shellRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.classList.add('inv-scroll-reveal-visible');
        document.dispatchEvent(new CustomEvent('aos:in', { detail: node }));
        observer.disconnect();
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [scrollAnimation, sectionId]);

  const classes = [
    'inv-section-shell',
    `inv-section-${sectionId}`,
    scrollAnimation ? 'inv-scroll-reveal' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={scrollAnimation ? shellRef : undefined}
      className={classes}
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
    gradualReveal,
    animateHero,
    scrollAnimation,
    showFollowMessage,
  } = ctx;

  switch (sectionId) {
    case 'hero':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <OpenedHeroSection event={event} invitation={invitation} animateHero={animateHero} />
        </SectionShell>
      );
    case 'quote_primary':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <QuoteBlock quote={invitation.quote} source={invitation.quote_source} compact />
        </SectionShell>
      );
    case 'story_intro':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <StoryIntroSection story={invitation.story} showMessages={false} />
        </SectionShell>
      );
    case 'quote_secondary':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <QuoteBlock quote={invitation.secondary_quote} compact />
        </SectionShell>
      );
    case 'couple_initials':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <CoupleInitialsSection event={event} invitation={invitation} />
        </SectionShell>
      );
    case 'invitation_message':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <StoryIntroSection
            showTitleImage={false}
            invitationMessage={invitation.story.invitation_message || invitation.invitation_message}
            acceptanceMessage={invitation.story.acceptance_message || invitation.acceptance_message}
          />
        </SectionShell>
      );
    case 'couple_showcase':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <CoupleShowcaseSection groom={invitation.groom_profile} bride={invitation.bride_profile} />
        </SectionShell>
      );
    case 'wedding_details':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <WeddingDetailsSection event={event} venue={invitation.venue} />
        </SectionShell>
      );
    case 'countdown':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <section className="inv-countdown-band" id="countdown">
            {invitation.gallery?.[2]?.image && <img src={invitation.gallery[2].image} alt="" />}
            <div className="inv-countdown-overlay">
              <p>The Countdown</p>
              <Countdown eventDate={event.event_date} />
              {showFollowMessage && (
                <p className="inv-countdown-follow">Formal invitation and further details to follow.</p>
              )}
            </div>
          </section>
        </SectionShell>
      );
    case 'rsvp':
      if (saveTheDateEnabled) return null;
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <RSVPForm eventId={event.id} note={invitation.rsvp_note} />
        </SectionShell>
      );
    case 'entourage':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <EntourageFullSection entourage={invitation.entourage} />
        </SectionShell>
      );
    case 'attire':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <AttireGuideSection
            attire={invitation.attire}
            dressCode={invitation.dress_code}
            invitation={invitation}
          />
        </SectionShell>
      );
    case 'program':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <TimelineSection program={invitation.program} coupleName={coupleName} />
        </SectionShell>
      );
    case 'gift_registry':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <GiftRegistry registry={invitation.gift_registry} />
        </SectionShell>
      );
    case 'faqs':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <FaqSection faqs={invitation.faqs} />
        </SectionShell>
      );
    case 'gallery':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <HappyMomentsSlideshow gallery={invitation.gallery} />
        </SectionShell>
      );
    case 'guest_book':
      return (
        <SectionShell sectionId={sectionId} floral scrollAnimation={scrollAnimation}>
          <GuestBook eventId={event.id} messages={guestMessages} />
        </SectionShell>
      );
    case 'qr_share':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
        </SectionShell>
      );
    case 'footer':
      return (
        <SectionShell sectionId={sectionId} floral={false} scrollAnimation={scrollAnimation}>
          <InvitationFooter eventName={coupleName} shareUrl={shareUrl} />
        </SectionShell>
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
  gradualReveal = false,
}) {
  const sectionCtx = {
    event,
    invitation,
    coupleName,
    shareUrl,
    guestMessages,
    saveTheDateEnabled,
    gradualReveal,
    animateHero: true,
  };

  const showFollowMessage = gradualReveal;

  return (
    <main id="inv-main" className="inv-main">
      {sectionOrder.map((sectionId, index) => {
        const skipScrollAnimation = gradualReveal && index === 0;
        const section = renderInvitationSection(sectionId, {
          ...sectionCtx,
          gradualReveal,
          animateHero: gradualReveal && index === 0,
          scrollAnimation: !skipScrollAnimation,
          showFollowMessage: sectionId === 'countdown' && showFollowMessage,
        });
        if (!section) return null;
        return <div key={sectionId}>{section}</div>;
      })}
    </main>
  );
}
