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

function SectionShell({ sectionId, floral, gradual, animateEntry, children }) {
  const content = floral ? (
    <FloralCornerFrame className="inv-floral-frame-section">{children}</FloralCornerFrame>
  ) : children;

  if (gradual) {
    return (
      <RevealSection enabled={animateEntry !== false} className={`inv-section-shell inv-section-${sectionId}`}>
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
  } = ctx;

  switch (sectionId) {
    case 'hero':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <OpenedHeroSection event={event} invitation={invitation} animateHero={animateHero} />
        </SectionShell>
      );
    case 'quote_primary':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <QuoteBlock quote={invitation.quote} source={invitation.quote_source} compact />
        </SectionShell>
      );
    case 'story_intro':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <StoryIntroSection story={invitation.story} showMessages={false} />
        </SectionShell>
      );
    case 'quote_secondary':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <QuoteBlock quote={invitation.secondary_quote} compact />
        </SectionShell>
      );
    case 'couple_initials':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <CoupleInitialsSection event={event} invitation={invitation} />
        </SectionShell>
      );
    case 'invitation_message':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <StoryIntroSection
            showTitleImage={false}
            invitationMessage={invitation.story.invitation_message || invitation.invitation_message}
            acceptanceMessage={invitation.story.acceptance_message || invitation.acceptance_message}
          />
        </SectionShell>
      );
    case 'couple_showcase':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <CoupleShowcaseSection groom={invitation.groom_profile} bride={invitation.bride_profile} />
        </SectionShell>
      );
    case 'wedding_details':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <WeddingDetailsSection event={event} venue={invitation.venue} />
        </SectionShell>
      );
    case 'countdown':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <section className="inv-countdown-band" id="countdown">
            {invitation.gallery?.[2]?.image && <img src={invitation.gallery[2].image} alt="" />}
            <div className="inv-countdown-overlay">
              <p>The Countdown</p>
              <Countdown eventDate={event.event_date} />
            </div>
          </section>
        </SectionShell>
      );
    case 'rsvp':
      if (saveTheDateEnabled) return null;
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <RSVPForm eventId={event.id} note={invitation.rsvp_note} />
        </SectionShell>
      );
    case 'entourage':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <EntourageFullSection entourage={invitation.entourage} />
        </SectionShell>
      );
    case 'attire':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <AttireGuideSection
            attire={invitation.attire}
            dressCode={invitation.dress_code}
            invitation={invitation}
          />
        </SectionShell>
      );
    case 'program':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <TimelineSection program={invitation.program} />
        </SectionShell>
      );
    case 'gift_registry':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <GiftRegistry registry={invitation.gift_registry} />
        </SectionShell>
      );
    case 'faqs':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <FaqSection faqs={invitation.faqs} />
        </SectionShell>
      );
    case 'gallery':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <HappyMomentsSlideshow gallery={invitation.gallery} />
        </SectionShell>
      );
    case 'guest_book':
      return (
        <SectionShell sectionId={sectionId} floral gradual={gradualReveal} animateEntry={animateEntry}>
          <GuestBook eventId={event.id} messages={guestMessages} />
        </SectionShell>
      );
    case 'qr_share':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
          <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
        </SectionShell>
      );
    case 'footer':
      return (
        <SectionShell sectionId={sectionId} floral={false} gradual={gradualReveal} animateEntry={animateEntry}>
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
  mode = 'full',
  revealedCount = 1,
  onShowNext,
  onViewFullInvitation,
}) {
  const sectionCtx = {
    event,
    invitation,
    coupleName,
    shareUrl,
    guestMessages,
    saveTheDateEnabled,
    gradualReveal: false,
    animateHero: mode === 'full',
    animateEntry: true,
  };

  if (mode === 'sequential') {
    const visibleOrder = sectionOrder.slice(0, revealedCount);

    return (
      <main id="inv-main" className="inv-main inv-main-sequential">
        {visibleOrder.map((sectionId, index) => (
          <div
            key={`${sectionId}-${index}`}
            className={index === revealedCount - 1 ? 'inv-sequential-new' : ''}
          >
            {renderInvitationSection(sectionId, {
              ...sectionCtx,
              gradualReveal: false,
              animateHero: index === 0,
              animateEntry: index === revealedCount - 1,
            })}
          </div>
        ))}

        <div className="inv-sequential-controls">
          {revealedCount < sectionOrder.length ? (
            <>
              <button type="button" className="btn btn-gold inv-sequential-btn" onClick={onShowNext}>
                Show Next Section
              </button>
              <p className="inv-sequential-progress">
                {revealedCount} of {sectionOrder.length} sections
              </p>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-gold inv-sequential-btn" onClick={onViewFullInvitation}>
                View Full Invitation
              </button>
              <p className="inv-sequential-progress">All sections unlocked</p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main id="inv-main" className="inv-main">
      {sectionOrder.map((sectionId) => {
        const section = renderInvitationSection(sectionId, sectionCtx);
        if (!section) return null;
        return <div key={sectionId}>{section}</div>;
      })}
    </main>
  );
}
