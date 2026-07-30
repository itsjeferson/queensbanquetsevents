import { useEffect, useState } from 'react';
import { getCoupleInitials } from '../../utils/invitationContent';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { removeImageBackground } from '../../utils/imageTransparent';

export default function CoupleInitialsSection({ event, invitation }) {
  const initials = getCoupleInitials(event, invitation);
  const rawLogoUrl = resolveMediaUrl(invitation?.couple_logo || invitation?.story?.couple_logo);
  const [transparentLogoUrl, setTransparentLogoUrl] = useState(rawLogoUrl);

  useEffect(() => {
    if (!rawLogoUrl) {
      setTransparentLogoUrl('');
      return;
    }

    let isMounted = true;
    removeImageBackground(rawLogoUrl).then((processedUrl) => {
      if (isMounted) {
        setTransparentLogoUrl(processedUrl);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [rawLogoUrl]);

  if (!initials && !rawLogoUrl) return null;

  return (
    <section className="inv-initials-section">
      {rawLogoUrl ? (
        <div className="inv-custom-logo-container">
          <img
            src={transparentLogoUrl || rawLogoUrl}
            alt="Couple Logo"
            className="inv-custom-logo-img"
          />
        </div>
      ) : (
        <div className="inv-initials-ring">
          <span className="inv-initials-text">{initials}</span>
        </div>
      )}
    </section>
  );
}
