import { useState } from 'react';
import CoverScreen from './CoverScreen';
import Countdown from './Countdown';
import OurStory from './OurStory';
import EventDetailsSection from './EventDetailsSection';
import Entourage from './Entourage';
import PhotoGallery from './PhotoGallery';
import VideoSection from './VideoSection';
import GiftRegistry from './GiftRegistry';
import RSVPForm from './RSVPForm';
import GuestBook from './GuestBook';
import QRShare from './QRShare';
import InvitationFooter from './InvitationFooter';

const TYPE_LABELS = {
  wedding: { together: 'Together With Their Families', invite: 'Invite You To Celebrate Their Wedding' },
  debut: { together: 'Together With Her Family', invite: 'Invite You To Her Debut Celebration' },
  birthday: { together: 'You Are Cordially Invited', invite: 'Join Us For A Birthday Celebration' },
  anniversary: { together: 'Together Through The Years', invite: 'Invite You To Celebrate Their Anniversary' },
  corporate: { together: 'You Are Invited', invite: 'Join Us For This Special Event' },
};

export default function InvitationRenderer({ data }) {
  const [opened, setOpened] = useState(false);
  const { event, invitation, guest_messages: guestMessages } = data;
  const labels = TYPE_LABELS[event.event_type] || TYPE_LABELS.wedding;
  const shareUrl = window.location.href;
  const primaryColor = invitation?.primary_color || '#D4AF37';

  const scrollToContent = () => {
    setOpened(true);
    setTimeout(() => document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div
      className="invitation-page"
      style={{ '--inv-primary': primaryColor }}
    >
      <CoverScreen event={event} invitation={invitation} onOpen={scrollToContent} labels={labels} />

      {opened && (
        <>
          <section className="inv-section-full" id="countdown">
            <div className="inv-section">
              <p className="inv-section-tag">Countdown</p>
              <h2>Until The Big Day</h2>
              <div className="inv-divider" />
              <Countdown eventDate={event.event_date} />
            </div>
          </section>

          <OurStory story={invitation?.story} />
          <EventDetailsSection venue={invitation?.venue} dressCode={invitation?.dress_code} program={invitation?.program} />
          {event.event_type === 'wedding' && <Entourage entourage={invitation?.entourage} />}
          <PhotoGallery gallery={invitation?.gallery} />
          <VideoSection videos={invitation?.videos} />
          <GiftRegistry registry={invitation?.gift_registry} />
          <RSVPForm eventId={event.id} />
          <GuestBook eventId={event.id} messages={guestMessages} />
          <QRShare url={shareUrl} enabled={invitation?.qr_enabled} />
          <InvitationFooter eventName={event.event_name} shareUrl={shareUrl} />
        </>
      )}
    </div>
  );
}
