import { parseEventDate } from '../../utils/eventDate';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { normalizeWeddingProgram } from '../../utils/weddingTimeline';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import RSVPForm from './RSVPForm';
import { getCustomizedAttireColors } from '../../utils/invitationTheme';

/* ─── Royal Gold Gradient Defs ──────────────────────── */
function GoldGradientDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="rlGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BE9B63" />
          <stop offset="30%" stopColor="#F3E7C4" />
          <stop offset="70%" stopColor="#BE9B63" />
          <stop offset="100%" stopColor="#A68042" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Royal Crest Ornament ──────────────────────────── */
function RoyalCrest({ flip = false }) {
  return (
    <div className={`rl-crest-container${flip ? ' rl-crest-flip' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="rl-crest-svg">
        <path d="M40 80 C 120 30, 280 30, 360 80" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60 90 C 130 50, 270 50, 340 90" stroke="url(#rlGoldGrad)" strokeWidth="0.75" strokeLinecap="round" opacity="0.6" />
        <path d="M200 15 L204 27 L216 31 L204 35 L200 47 L196 35 L184 31 L196 27 Z" fill="url(#rlGoldGrad)" />
        <circle cx="160" cy="40" r="2.5" fill="url(#rlGoldGrad)" />
        <circle cx="240" cy="40" r="2.5" fill="url(#rlGoldGrad)" />
        <circle cx="120" cy="55" r="2" fill="url(#rlGoldGrad)" opacity="0.8" />
        <circle cx="280" cy="55" r="2" fill="url(#rlGoldGrad)" opacity="0.8" />
      </svg>
    </div>
  );
}

/* ─── Monogram Crest ────────────────────────────────── */
function MonogramCrest({ initL, initR }) {
  return (
    <div className="rl-monogram-container">
      <div className="rl-monogram-shield">
        <svg viewBox="0 0 100 100" className="rl-monogram-ring" aria-hidden="true">
          <circle cx="50" cy="50" r="46" stroke="url(#rlGoldGrad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="42" stroke="url(#rlGoldGrad)" strokeWidth="1.5" fill="none" />
          {/* Elegant top crown accent */}
          <path d="M40 26 L44 34 L50 29 L56 34 L60 26 L54 30 L50 26 L46 30 Z" fill="url(#rlGoldGrad)" />
        </svg>
        <div className="rl-monogram-letters">
          <span className="rl-mono-char">{initL || 'R'}</span>
          <span className="rl-mono-amp">&</span>
          <span className="rl-mono-char">{initR || 'J'}</span>
        </div>
      </div>
      <p className="rl-monogram-subtitle">OUR WEDDING</p>
    </div>
  );
}

/* ─── Luxury Divider ────────────────────────────────── */
function LuxuryDivider() {
  return (
    <div className="rl-luxury-divider" aria-hidden="true">
      <div className="rl-line-left" />
      <svg viewBox="0 0 24 24" className="rl-divider-diamond">
        <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="url(#rlGoldGrad)" />
      </svg>
      <div className="rl-line-right" />
    </div>
  );
}

/* ─── Location Card ──────────────────────────────────── */
function LocationCard({ type, time, title, subtitle, address, mapUrl }) {
  return (
    <div className="rl-location-card">
      <div className="rl-card-inner">
        <span className="rl-location-type">{type}</span>
        <h3 className="rl-location-title">{title}</h3>
        {time && <p className="rl-location-time">{time}</p>}
        {subtitle && <p className="rl-location-subtitle">{subtitle}</p>}
        {address && <p className="rl-location-address">{address}</p>}
        {mapUrl && (
          <a href={mapUrl} target="_blank" rel="noreferrer" className="rl-location-btn">
            <span>SEE LOCATION</span>
          </a>
        )}
      </div>
    </div>
  );
}

const GiftIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

/* ─── Timeline SVGs ──────────────────────────────────── */
const ChurchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v6m-3-3h6M4 22v-9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9M9 22v-4a3 3 0 0 1 6 0v4M12 10V8" />
  </svg>
);

const CocktailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l-6 9v8M9 21h6M5 3c0 3.5 3 6 7 6s7-2.5 7-6" />
    <circle cx="17" cy="7" r="1" fill="url(#rlGoldGrad)" />
  </svg>
);

const FireworksIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4 12h4M18 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BanquetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7" />
    <path d="M5 7v5a2 2 0 0 0 4 0V7M7 7v7M16 7v10h1M19 7v5a1 1 0 0 0 1 1h1V7" />
  </svg>
);

const PartyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v3M12 19v3M5 12h14M8.5 8.5l7 7M8.5 15.5l7-7" />
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#rlGoldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const ITINERARY_SVG_ICONS = [
  <ChurchIcon />,
  <CocktailIcon />,
  <FireworksIcon />,
  <BanquetIcon />,
  <PartyIcon />,
  <ClockIcon />
];

/* ─── Itinerary Item ─────────────────────────────────── */
function ItineraryRow({ time, label, icon }) {
  return (
    <div className="rl-itinerary-row">
      <div className="rl-itinerary-icon-col">
        <div className="rl-itinerary-icon-wrapper">
          {icon}
        </div>
      </div>
      <div className="rl-itinerary-timeline-col">
        <div className="rl-timeline-tick" />
      </div>
      <div className="rl-itinerary-text-col">
        <span className="rl-itinerary-time">{time}</span>
        <span className="rl-itinerary-label">{label}</span>
      </div>
    </div>
  );
}

/* ─── Main Royal Luxury Invitation ──────────────────── */
export default function RoyalLuxuryInvitation({ event, invitation, guestMessages, shareUrl, saveTheDateEnabled }) {
  const parsed = parseEventDate(event?.event_date);
  const coupleName = getCoupleDisplayName(event, invitation);
  const coverImage = resolveMediaUrl(invitation?.cover_image);
  const bottomImage = resolveMediaUrl(invitation?.gallery?.[0]?.image);
  const venue = invitation?.venue || {};
  const ceremony = venue.ceremony || {};
  const reception = venue.reception || {};
  const program = normalizeWeddingProgram(invitation?.program);
  const quote = invitation?.quote || '';
  const quoteSource = invitation?.quote_source || '';
  const openingLine = invitation?.opening_line || '';
  const groomParents = invitation?.entourage?.groom_parents || '';
  const brideParents = invitation?.entourage?.bride_parents || '';
  const passesCount = invitation?.passes_count || 2;
  const giftNote = invitation?.gift_registry?.note || '';
  const rsvpNote = invitation?.rsvp_note || '';
  const adultsNote = invitation?.attire?.reminders || '';
  const coupleInitials = invitation?.couple_initials || (() => {
    if (!coupleName) return 'R J';
    const clean = coupleName.replace('&', '').replace('and', '').replace('+', '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    return parts.length >= 2 ? `${parts[0][0]} ${parts[1][0]}` : coupleName.slice(0, 2).toUpperCase();
  })();

  const [initL, initR] = coupleInitials.split(/\s+/);

  const dateDay = parsed
    ? parsed.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    : '';
  const dateNum = parsed ? parsed.getDate() : '';
  const dateYear = parsed ? parsed.getFullYear() : '';
  const dateMonth = parsed
    ? parsed.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
    : '';

  return (
    <div className="rl-invitation-root">
      <GoldGradientDefs />

      {/* Luxury Crest Top */}
      <RoyalCrest />

      {/* Quote */}
      {quote && (
        <div className="rl-left-quote">
          <p>“{quote}”</p>
          {quoteSource && <span className="rl-left-quote-src">— {quoteSource}</span>}
        </div>
      )}

      {/* Monogram */}
      <MonogramCrest initL={initL} initR={initR} />

      {/* Couple Photo Frame with luxury shadow & border */}
      <div className="rl-cover-photo-frame">
        <div className="rl-frame-border-outer">
          <div className="rl-frame-border-inner">
            {coverImage ? (
              <img src={coverImage} alt={coupleName} className="rl-cover-photo-img" />
            ) : (
              <div className="rl-cover-photo-fallback">
                <span>✨</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parents blessing */}
      {(openingLine || groomParents || brideParents) && (
        <div className="rl-parents-block">
          <span className="rl-section-subtitle">THE BLESSING OF FAMILY</span>
          {openingLine && <p className="rl-parents-blessing">{openingLine}</p>}
          <div className="rl-parents-grid">
            {groomParents && (
              <div className="rl-parents-side">
                <span className="rl-parents-side-label">Groom's Parents</span>
                <p className="rl-parents-name">{groomParents}</p>
              </div>
            )}
            {groomParents && brideParents && <div className="rl-parents-separator-line" />}
            {brideParents && (
              <div className="rl-parents-side">
                <span className="rl-parents-side-label">Bride's Parents</span>
                <p className="rl-parents-name">{brideParents}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Middle Ornament */}
      <RoyalCrest flip />

      {/* Couple names offset layout */}
      <div className="rl-couple-names-wrapper">
        <h1 className="rl-couple-first">{coupleName ? coupleName.split(/\s+(?:&|and|\+)\s+/i)[0] : 'Rafaela'}</h1>
        <span className="rl-couple-and">and</span>
        <h1 className="rl-couple-second">{coupleName ? coupleName.split(/\s+(?:&|and|\+)\s+/i)[1] : 'Josué'}</h1>
      </div>
      
      <p className="rl-tagline">CORDIALLY INVITE YOU TO JOIN US IN CELEBRATING OUR MARRIAGE</p>

      {/* Date box */}
      {parsed && (
        <div className="rl-date-box">
          <div className="rl-date-line-decor" />
          <div className="rl-date-center">
            <span className="rl-date-month">{dateMonth}</span>
            <span className="rl-date-num">{dateNum}</span>
            <span className="rl-date-details">{dateDay} • {dateYear}</span>
          </div>
          <div className="rl-date-line-decor" />
        </div>
      )}

      {/* Divider */}
      <LuxuryDivider />

      {/* Venue locations */}
      <div className="rl-locations-section">
        <h2 className="rl-section-title">THE CELEBRATION</h2>
        <div className="rl-locations-grid">
          {(ceremony.name || ceremony.address) && (
            <LocationCard
              type="THE CEREMONY"
              time={ceremony.time}
              title={ceremony.name || 'Religious Ceremony'}
              subtitle={ceremony.subtitle}
              address={ceremony.address}
              mapUrl={ceremony.map_url}
            />
          )}
          {(reception.name || reception.address) && (
            <LocationCard
              type="THE RECEPTION"
              time={reception.time}
              title={reception.name || 'Reception Dinner'}
              subtitle={reception.subtitle}
              address={reception.address}
              mapUrl={reception.map_url}
            />
          )}
        </div>
      </div>

      {/* Itinerary / Activities */}
      {program.length > 0 && (
        <div className="rl-itinerary-block">
          <h2 className="rl-section-title">ITINERARY</h2>
          <div className="rl-itinerary-content">
            {program.map((item, i) => (
              <ItineraryRow
                key={item.id || i}
                time={item.time}
                label={item.title || item.event}
                icon={ITINERARY_SVG_ICONS[i % ITINERARY_SVG_ICONS.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* What To Wear */}
      {(invitation?.dress_code || invitation?.attire?.female_primary_sponsors || invitation?.attire?.male_primary_sponsors || invitation?.attire?.ladies || invitation?.attire?.gentlemen || invitation?.attire?.reminders) && (
        <div className="rl-attire-block">
          <h4 className="rl-attire-heading">WHAT TO WEAR</h4>
          {invitation.dress_code && (
            <p className="rl-attire-dresscode">
              Dress Code: <strong>{invitation.dress_code}</strong>
            </p>
          )}

          {invitation.attire?.female_primary_sponsors && (
            <div className="rl-attire-sub-block">
              <h5 className="rl-attire-sub-title">FEMALE PRIMARY SPONSORS</h5>
              <p className="rl-attire-sub-desc">{invitation.attire.female_primary_sponsors}</p>
              {invitation.attire.female_primary_sponsors_colors && (
                <div className="rl-attire-colors">
                  {getCustomizedAttireColors(invitation.attire.female_primary_sponsors_colors).map((color, idx) => (
                    <span key={idx} className="rl-attire-color-swatch" style={{ background: color }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {invitation.attire?.male_primary_sponsors && (
            <div className="rl-attire-sub-block">
              <h5 className="rl-attire-sub-title">MALE PRIMARY SPONSORS</h5>
              <p className="rl-attire-sub-desc">{invitation.attire.male_primary_sponsors}</p>
              {invitation.attire.male_primary_sponsors_colors && (
                <div className="rl-attire-colors">
                  {getCustomizedAttireColors(invitation.attire.male_primary_sponsors_colors).map((color, idx) => (
                    <span key={idx} className="rl-attire-color-swatch" style={{ background: color }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {(invitation.attire?.ladies || invitation.attire?.gentlemen) && (
            <div className="rl-attire-guests">
              <h5 className="rl-attire-sub-title" style={{ color: '#ffffff', fontSize: '13px', marginBottom: '16px' }}>GUEST</h5>
              
              {invitation.attire?.ladies && (
                <div className="rl-attire-sub-block">
                  <h6 className="rl-attire-sub-title">LADIES</h6>
                  <p className="rl-attire-sub-desc">{invitation.attire.ladies}</p>
                  {invitation.attire.ladies_colors && (
                    <div className="rl-attire-colors">
                      {getCustomizedAttireColors(invitation.attire.ladies_colors).map((color, idx) => (
                        <span key={idx} className="rl-attire-color-swatch" style={{ background: color }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {invitation.attire?.gentlemen && (
                <div className="rl-attire-sub-block">
                  <h6 className="rl-attire-sub-title">GENTLEMEN</h6>
                  <p className="rl-attire-sub-desc">{invitation.attire.gentlemen}</p>
                  {invitation.attire.gentlemen_colors && (
                    <div className="rl-attire-colors">
                      {getCustomizedAttireColors(invitation.attire.gentlemen_colors).map((color, idx) => (
                        <span key={idx} className="rl-attire-color-swatch" style={{ background: color }} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {invitation.attire?.reminders && (
            <div className="rl-attire-reminders">
              <p>{invitation.attire.reminders}</p>
            </div>
          )}
        </div>
      )}

      {/* RSVP / Confirmation */}
      {!saveTheDateEnabled && (
        <div className="rl-confirm-block">
          <h4 className="rl-rsvp-heading">RSVP CONFIRMATION</h4>
          {rsvpNote && <p className="rl-rsvp-body">{rsvpNote}</p>}
          <div className="rl-rsvp-form-container">
            <RSVPForm eventId={event?.id} note="" compact hideHeader={true} />
          </div>
        </div>
      )}

      {/* Gift registry note */}
      {((invitation?.gift_registry?.preferences || invitation?.gift_registry?.note) || invitation?.gift_registry?.payment_details) && (
        <div className="rl-gift-block">
          <div className="rl-gift-card-inner">
            <div className="rl-gift-icon-gold">
              <GiftIcon />
            </div>
            <h4 className="rl-gift-heading">WEDDING GIFT</h4>
            <p className="rl-gift-body">
              {invitation?.gift_registry?.preferences || invitation?.gift_registry?.note}
            </p>
            {invitation?.gift_registry?.payment_details && (
              <>
                <div className="rl-gift-divider" />
                <h5 className="rl-gift-payment-title">PAYMENT DETAILS</h5>
                <p className="rl-gift-payment-body">
                  {invitation.gift_registry.payment_details}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Closing words */}
      <p className="rl-closing-words">YOUR PRESENCE IS OUR GREATEST GIFT</p>

      {/* Bottom couple photo */}
      {bottomImage && (
        <div className="rl-bottom-photo">
          <div className="rl-frame-border-outer">
            <div className="rl-frame-border-inner">
              <img src={bottomImage} alt={coupleName} className="rl-bottom-photo-img" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
