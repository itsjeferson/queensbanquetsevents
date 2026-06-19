import { useRef, useState } from 'react';
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
import { parseEventDate } from '../../utils/eventDate';

const TYPE_LABELS = {
  wedding: { together: 'Together With Their Families', invite: 'Invite You To Celebrate Their Wedding' },
  debut: { together: 'Together With Her Family', invite: 'Invite You To Her Debut Celebration' },
  birthday: { together: 'You Are Cordially Invited', invite: 'Join Us For A Birthday Celebration' },
  anniversary: { together: 'Together Through The Years', invite: 'Invite You To Celebrate Their Anniversary' },
  corporate: { together: 'You Are Invited', invite: 'Join Us For This Special Event' },
};

function formatDate(dateValue) {
  const parsed = parseEventDate(dateValue);
  if (!parsed) return '';
  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function InvitationRenderer({ data }) {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const { event, invitation = {}, guest_messages: guestMessages } = data;
  const labels = TYPE_LABELS[event.event_type] || TYPE_LABELS.wedding;
  const shareUrl = window.location.href;
  const primaryColor = invitation.primary_color || '#B47B36';
  const secondaryColor = invitation.secondary_color || '#EFE7DD';

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
    <div
      className="invitation-page"
      style={{ '--inv-primary': primaryColor, '--inv-paper': secondaryColor }}
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
          <section className="inv-hero-photo">
            {invitation.background_video ? (
              <video src={invitation.background_video} autoPlay muted loop playsInline />
            ) : invitation.cover_image ? (
              <img src={invitation.cover_image} alt={event.event_name} />
            ) : (
              <div className="inv-hero-placeholder" />
            )}
            <div className="inv-hero-title">
              <h1>{event.event_name}</h1>
              <span>{formatDate(event.event_date)}</span>
            </div>
          </section>

          {(invitation.quote || invitation.quote_source) && (
            <section className="inv-quote-band">
              {invitation.quote && <p>{invitation.quote}</p>}
              {invitation.quote_source && <strong>{invitation.quote_source}</strong>}
            </section>
          )}

          <OurStory story={invitation.story} gallery={invitation.gallery} />
          <EventDetailsSection event={event} venue={invitation.venue} dressCode={invitation.dress_code} program={invitation.program} />

          <section className="inv-countdown-band" id="countdown">
            {invitation.gallery?.[2]?.image && <img src={invitation.gallery[2].image} alt="" />}
            <div className="inv-countdown-overlay">
              <p>Counting Down To The Big Day</p>
              <Countdown eventDate={event.event_date} />
            </div>
          </section>

          <RSVPForm eventId={event.id} note={invitation.rsvp_note} />
          {event.event_type === 'wedding' && <Entourage entourage={invitation.entourage} />}
          <PhotoGallery gallery={invitation.gallery} />
          <VideoSection videos={invitation.videos} />
          <GiftRegistry registry={invitation.gift_registry} />

          {invitation.attire && (invitation.attire.primary || invitation.attire.guests || invitation.attire.reminders) && (
            <section className="inv-section inv-attire-section">
              <p className="inv-script-title">What to wear?</p>
              <h2>Dress Guide</h2>
              <div className="inv-divider" />
              {invitation.attire.primary && <p>{invitation.attire.primary}</p>}
              {invitation.attire.guests && <p>{invitation.attire.guests}</p>}
              {invitation.attire.reminders && <p>{invitation.attire.reminders}</p>}
            </section>
          )}

          {invitation.faqs?.length > 0 && (
            <section className="inv-section inv-faq-section">
              <p className="inv-script-title">Frequently Asked Questions</p>
              <div className="inv-faq-list">
                {invitation.faqs.map((item, index) => (
                  <details key={index}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <GuestBook eventId={event.id} messages={guestMessages} />
          <QRShare url={shareUrl} enabled={invitation.qr_enabled} />
          <InvitationFooter eventName={event.event_name} shareUrl={shareUrl} />
        </main>
      )}
    </div>
  );
}
