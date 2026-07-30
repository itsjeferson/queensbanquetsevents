import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/cinematic-footer.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function MagneticButton({ children, className = '', as: Component = 'button', ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const h = rect.width / 2;
        const w = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - w;
        gsap.to(el, { x: x * 0.4, y: y * 0.4, rotationX: -y * 0.15, rotationY: x * 0.15, scale: 1.05, ease: 'power2.out', duration: 0.4 });
      };
      const handleMouseLeave = () => {
        gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1, 0.3)', duration: 1.2 });
      };
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Component ref={ref} className={`${className}`} {...props}>
      {children}
    </Component>
  );
}

function MarqueeItem() {
  return (
    <div className="cf-marquee-item">
      <span>Forever Begins Today</span> <span className="cf-marquee-dot">✦</span>
      <span>With Love</span> <span className="cf-marquee-dot">✦</span>
      <span>One Heart</span> <span className="cf-marquee-dot">✦</span>
      <span>One Journey</span> <span className="cf-marquee-dot">✦</span>
      <span>Till Death Do Us Part</span> <span className="cf-marquee-dot">✦</span>
      <span>A New Chapter</span> <span className="cf-marquee-dot">✦</span>
      <span>Celebrate Love</span> <span className="cf-marquee-dot">✦</span>
    </div>
  );
}

export default function CinematicInvitationFooter({ eventName = '', shareUrl = '', coupleName = '' }) {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  const displayName = coupleName || eventName || 'Forever';

  useEffect(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(giantTextRef.current,
            { opacity: 0, scale: 0.8, y: '5vh' },
            { opacity: 1, scale: 1, y: '0vh', duration: 1.2, ease: 'power2.out' }
          );
          gsap.fromTo([headingRef.current, linksRef.current],
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  const handleRsvpClick = (e) => {
    e.preventDefault();
    const rsvpSection = document.getElementById('rsvp');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = 'rsvp';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: eventName || 'Wedding Invitation', url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={wrapperRef} className="cf-wrapper">
      <div className="cf-aurora" />
      <div className="cf-grid" />

      <div ref={giantTextRef} className="cf-giant-text">
        {displayName}
      </div>

      <div className="cf-marquee-band">
        <div className="cf-marquee-inner">
          <MarqueeItem />
          <MarqueeItem />
        </div>
      </div>

      <div className="cf-center">
        <h2 ref={headingRef} className="cf-heading">
          With Love, Forever
        </h2>

        <div ref={linksRef} className="cf-links">
          <div className="cf-buttons-primary">
            <MagneticButton as="a" href="#rsvp" onClick={handleRsvpClick} className="cf-glass-pill">
              <svg className="cf-glass-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              RSVP Now
            </MagneticButton>
            <MagneticButton as="button" onClick={handleShare} className="cf-glass-pill">
              <svg className="cf-glass-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share Invitation
            </MagneticButton>
          </div>

          <div className="cf-buttons-secondary">
            <MagneticButton as="a" href="#guest_book" className="cf-glass-pill cf-glass-pill-sm">
              Write in Guest Book
            </MagneticButton>
            <MagneticButton as="a" href="#gallery" className="cf-glass-pill cf-glass-pill-sm">
              View Gallery
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="cf-bottom-bar">
        <div className="cf-copyright">
          &copy; {new Date().getFullYear()} Queen&apos;s Banquet Events
        </div>

        <div className="cf-love-badge">
          <span className="cf-love-badge-label">Crafted with</span>
          <span className="cf-love-heart">&#9829;</span>
          <span className="cf-love-badge-label">by</span>
          <span className="cf-love-brand">Queen's Banquet</span>
        </div>

        <MagneticButton as="button" onClick={scrollToTop} className="cf-back-top">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </MagneticButton>
      </div>
    </div>
  );
}
