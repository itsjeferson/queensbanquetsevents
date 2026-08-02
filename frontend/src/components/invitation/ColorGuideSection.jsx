import { defaultColorGuide } from '../../utils/invitationContent';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function ColorGuideSection({ colorGuide = [], image = '' }) {
  const items = Array.isArray(colorGuide) && colorGuide.length > 0 ? colorGuide : defaultColorGuide();

  // Helper to determine text color inside swatch for readability
  const isLightColor = (hex) => {
    if (!hex || typeof hex !== 'string') return false;
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return true;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 185;
  };

  const resolvedImage = resolveMediaUrl(image);

  return (
    <section className="inv-section inv-color-guide-section" id="color_guide">
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', letterSpacing: '0.12em', textAlign: 'center', margin: '0 0 12px', textTransform: 'uppercase' }}>
        COLOR GUIDE
      </h2>
      <div className="inv-divider" style={{ margin: '0 auto 36px', maxWidth: '180px' }} />

      {resolvedImage ? (
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto', padding: '0 16px' }}>
          <img
            src={resolvedImage}
            alt="Color Guide"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          />
        </div>
      ) : (
        <div
          className="inv-color-guide-grid"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px 16px',
            alignItems: 'center',
            maxWidth: '820px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          {items.map((item, idx) => {
            const isLight = isLightColor(item.color);
            const textColor = isLight ? '#2d2d2d' : '#ffffff';

            return (
              <div
                key={idx}
                className="inv-color-guide-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '120px',
                }}
              >
                <div
                  className="inv-color-circle"
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    backgroundColor: item.color || '#cccccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                    border: isLight ? '1px solid rgba(0,0,0,0.08)' : 'none',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      lineHeight: 1.25,
                      color: textColor,
                      textTransform: 'uppercase',
                      wordBreak: 'break-word',
                      userSelect: 'none',
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
