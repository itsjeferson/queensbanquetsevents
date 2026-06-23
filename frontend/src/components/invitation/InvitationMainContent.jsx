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
import RevealSection from './RevealSection';
import FloralCornerFrame from './FloralCornerFrame';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function SectionShell({ sectionId, floral, gradual, animateEntry, onRevealed, children }) {
  const content = floral ? (
    <FloralCornerFrame className="inv-floral-frame-section">{children}</FloralCornerFrame>
  ) : children;

  if (gradual) {
    return (
      <RevealSection
        enabled={animateEntry !== false}
        onRevealed={onRevealed}
        className={`inv-section-shell inv-section-${sectionId}`}
      >
        {content}
      </RevealSection>
    );
  }

  return <div className={`inv-section-shell inv-section-${sectionId}`}>{content}</div>;
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
    animateEntry,
    showFollowMessage,
    onSectionRevealed,
  } = ctx;

  switch (sectionId) {
    case 'hero':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <OpenedHeroSection event={event} invitation={invitation} animateHero={animateHero} />
        </SectionShell>
      );
    case 'quote_primary':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <QuoteBlock quote={invitation.quote} source={invitation.quote_source} compact />
        </SectionShell>
      );
    case 'story_intro':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <StoryIntroSection story={invitation.story} showMessages={false} />
        </SectionShell>
      );
    case 'quote_secondary':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <QuoteBlock quote={invitation.secondary_quote} compact />
        </SectionShell>
      );
    case 'couple_initials':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <CoupleInitialsSection event={event} invitation={invitation} />
        </SectionShell>
      );
    case 'invitation_message':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <StoryIntroSection
            showTitleImage={false}
            invitationMessage={invitation.story.invitation_message || invitation.invitation_message}
            acceptanceMessage={invitation.story.acceptance_message || invitation.acceptance_message}
          />
        </SectionShell>
      );
    case 'couple_showcase':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <CoupleShowcaseSection groom={invitation.groom_profile} bride={invitation.bride_profile} />
        </SectionShell>
      );
    case 'wedding_details':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <WeddingDetailsSection event={event} venue={invitation.venue} />
        </SectionShell>
      );
    case 'countdown':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
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
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <RSVPForm eventId={event.id} note={invitation.rsvp_note} />
        </SectionShell>
      );
    case 'entourage':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <EntourageFullSection entourage={invitation.entourage} />
        </SectionShell>
      );
    case 'attire':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <AttireGuideSection
            attire={invitation.attire}
            dressCode={invitation.dress_code}
            invitation={invitation}
          />
        </SectionShell>
      );
    case 'program':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <TimelineSection program={invitation.program} />
        </SectionShell>
      );
    case 'gift_registry':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <GiftRegistry registry={invitation.gift_registry} />
        </SectionShell>
      );
    case 'faqs':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <FaqSection faqs={invitation.faqs} />
        </SectionShell>
      );
    case 'gallery':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <HappyMomentsSlideshow gallery={invitation.gallery} />
        </SectionShell>
      );
    case 'guest_book':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <GuestBook eventId={event.id} messages={guestMessages} />
        </SectionShell>
      );
    case 'qr_share':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
          <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
        </SectionShell>
      );
    case 'footer':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry} onRevealed={onSectionRevealed}>
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
    animateEntry: true,
  };

  const trackableSectionIds = useMemo(
    () => sectionOrder.filter((id) => !(id === 'rsvp' && saveTheDateEnabled)),
    [sectionOrder, saveTheDateEnabled],
  );

  const [allContentRevealed, setAllContentRevealed] = useState(!gradualReveal);
  const revealedSectionIds = useRef(new Set());

  useEffect(() => {
    if (!gradualReveal) {
      setAllContentRevealed(true);
      return;
    }
    revealedSectionIds.current = new Set();
    setAllContentRevealed(trackableSectionIds.length === 0);
  }, [gradualReveal, trackableSectionIds]);

  const handleSectionRevealed = useCallback((sectionId) => {
    revealedSectionIds.current.add(sectionId);
    if (revealedSectionIds.current.size >= trackableSectionIds.length) {
      setAllContentRevealed(true);
    }
  }, [trackableSectionIds.length]);

  const showFollowMessage = gradualReveal && !allContentRevealed;

  return (
    <main id="inv-main" className="inv-main">
      {sectionOrder.map((sectionId, index) => {
        const section = renderInvitationSection(sectionId, {
          ...sectionCtx,
          gradualReveal,
          animateHero: gradualReveal && index === 0,
          animateEntry: gradualReveal && index > 0,
          showFollowMessage: sectionId === 'countdown' && showFollowMessage,
          onSectionRevealed: gradualReveal ? () => handleSectionRevealed(sectionId) : undefined,
        });
        if (!section) return null;
        return <div key={sectionId}>{section}</div>;
      })}
    </main>
  );
}
