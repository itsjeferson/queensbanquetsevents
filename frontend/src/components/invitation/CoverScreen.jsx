import { useState } from 'react';
import { parseEventDate } from '../../utils/eventDate';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import { isDirectVideoUrl, resolveMediaUrl } from '../../utils/mediaUrl';
import { Spinner } from '../common/Loader/Loader';

const OPEN_DELAY_MS = 900;

function adjustColorBrightness(hex, percent) {
  if (!hex || hex.startsWith('url') || !hex.startsWith('#')) return hex;
  let num = parseInt(hex.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
}

function getContrastColor(hex) {
  if (!hex || !hex.startsWith('#')) return null;
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#111827' : '#ffffff';
}

function getOpenDelay() {
  if (typeof window === 'undefined') return OPEN_DELAY_MS;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : OPEN_DELAY_MS;
}

export default function CoverScreen({ event, invitation, onOpen, labels }) {
  const [opening, setOpening] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const parsed = parseEventDate(event.event_date);
  const date = parsed
    ? parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : '';
  const coupleName = getCoupleDisplayName(event, invitation);
  const coverImage = resolveMediaUrl(invitation?.cover_image);
  const backgroundVideo = resolveMediaUrl(invitation?.background_video);
  const useVideo = Boolean(backgroundVideo) && isDirectVideoUrl(backgroundVideo);

  const isRoyalLuxury = Number(invitation?.template_id) === 3;
  const isModernMinimalist = Number(invitation?.template_id) === 2;
  const useEnvelope = isRoyalLuxury || isModernMinimalist;

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => onOpen?.(), getOpenDelay());
  };

  const handleSealClick = () => {
    if (envelopeOpened || opening) return;
    setEnvelopeOpened(true);
    setOpening(true);
    
    // Start envelope fade-out after it opens
    window.setTimeout(() => {
      setFadeOut(true);
    }, 1400);

    // Completely unmount CoverScreen after the fade-out completes
    window.setTimeout(() => {
      onOpen?.();
    }, 2200);
  };

  const getInitials = (name) => {
    if (!name) return 'R J';
    const clean = name.replace('&', '').replace('and', '').replace('+', '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(coupleName);
  const names = coupleName ? coupleName.split(/\s+(?:&|and|\+)\s+/i) : ['Mark', 'She'];
  const firstName = names[0] ? names[0].trim() : 'Mark';
  const lastName = names[1] ? names[1].trim() : 'She';

  if (useEnvelope) {
    const themeClass = isRoyalLuxury ? 'theme-royal-luxury' : 'theme-modern-minimalist';
    
    // Generate custom shades dynamically for envelope and seal if selected
    const customStyles = {};
    if (invitation?.envelope_color) {
      const base = invitation.envelope_color;
      const isDark = getContrastColor(base) === '#ffffff';
      customStyles['--env-bg'] = base;
      customStyles['--env-flap-left'] = adjustColorBrightness(base, 5);
      customStyles['--env-flap-right'] = adjustColorBrightness(base, 5);
      customStyles['--env-flap-top'] = adjustColorBrightness(base, 10);
      customStyles['--env-text-color'] = isDark ? (isRoyalLuxury ? '#BE9B63' : '#ffffff') : '#111827';
      customStyles['--env-backdrop-bg'] = isDark ? adjustColorBrightness(base, -40) : adjustColorBrightness(base, 25);
    }
    if (invitation?.seal_color) {
      const base = invitation.seal_color;
      customStyles['--seal-bg-start'] = base;
      customStyles['--seal-bg-end'] = adjustColorBrightness(base, -15);
      customStyles['--seal-border'] = adjustColorBrightness(base, -25);
    }

    return (
      <section 
        className={`inv-cover inv-cover-envelope ${themeClass} ${fadeOut ? 'rl-fade-out' : ''}`} 
        id="cover"
        style={customStyles}
      >
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

        <div 
          className={`rl-envelope-container ${envelopeOpened ? 'rl-envelope-open' : ''}`}
        >
          {/* Back flap of envelope */}
          <div className="rl-envelope-back" />



          {/* Left and right fold flaps of envelope */}
          <div className="rl-envelope-left" />
          <div className="rl-envelope-right" />
          
          {/* Top flap of envelope (flips open) */}
          <div className="rl-envelope-top" />

          {/* Wax seal to trigger opening */}
          <div className="rl-wax-seal-wrapper">
            <span className="rl-envelope-label-top">{firstName}</span>
            <div className="rl-wax-seal" onClick={handleSealClick}>
              <div className="rl-wax-seal-crest">
                <span>{initials[0]}</span>
                <span className="rl-seal-amp">&</span>
                <span>{initials[1]}</span>
              </div>
            </div>
            <span className="rl-envelope-label-bottom">{lastName}</span>
            <span className="rl-seal-hint">TAP SEAL TO OPEN</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="inv-cover" id="cover">
      {useVideo ? (
        <video className="inv-cover-video" src={backgroundVideo} autoPlay muted loop playsInline />
      ) : coverImage ? (
        <img src={coverImage} alt="" className="inv-cover-bg" />
      ) : (
        <div className="inv-cover-bg inv-cover-bg-fallback" />
      )}
      <div className="inv-cover-shade" />
      <div className="inv-cover-content">
        {invitation?.opening_line && (
          <p className="inv-subtitle inv-cover-opening">{invitation.opening_line}</p>
        )}
        {!invitation?.opening_line && labels?.together && (
          <p className="inv-subtitle inv-cover-opening">{labels.together}</p>
        )}

        {invitation?.hero_caption && (
          <p className="inv-tagline inv-cover-caption">{invitation.hero_caption}</p>
        )}

        <h1 className="inv-cover-couple">{coupleName}</h1>
        {date && <p className="inv-date">{date}</p>}
        <button type="button" className="inv-open-btn" onClick={handleOpen} disabled={opening} aria-busy={opening}>
          {opening ? (
            <span className="btn-loading">
              <Spinner size="sm" tone="dark" />
              <span>Opening invitation...</span>
            </span>
          ) : 'Open Invitation'}
        </button>
      </div>
    </section>
  );
}
