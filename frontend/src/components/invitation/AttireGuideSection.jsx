import { getCustomizedAttireColors } from '../../utils/invitationTheme';

const GENTLEMEN_PANTS_COLOR_GUIDE = [
  { role: 'Groom', name: 'Dark Brown', colors: ['#4E342E'] },
  { role: 'Ninongs', name: 'Light Brown', colors: ['#A1887F'] },
  { role: 'Groomsmen & Secondary Sponsors', name: 'Black', colors: ['#111111'] },
  { role: 'All Other Gentlemen', name: 'Black', colors: ['#111111'] },
];

const LADIES_GOWNS_COLOR_GUIDE = [
  { role: 'Mothers of the Couple', name: 'Beacon Blue', colors: ['#0288D1'] },
  { role: 'Ninangs', name: 'Mid-Blue', colors: ['#1E88E5'] },
  { role: 'Bridesmaids', name: 'Pale Blue or Lime Cream', colors: ['#81D4FA', '#9ECE75'] },
  { role: 'Female Secondary Sponsors', name: 'Titanite Green', colors: ['#43A047'] },
  { role: 'All Other Ladies', name: 'Light Beige, Warm Taupe, Sage Green, or Espresso', colors: ['#F5F5DC', '#B0A99F', '#87A96B', '#362819'] },
];

function AttireColorSwatches({ colors, prefix }) {
  const displayColors = getCustomizedAttireColors(colors);
  if (!displayColors.length) return null;

  return (
    <div className="inv-color-swatches">
      {displayColors.map((color, index) => (
        <span
          key={`${prefix}-${color}-${index}`}
          className="inv-color-swatch"
          style={{ background: color }}
          title={color}
        />
      ))}
    </div>
  );
}

function AttireBlock({ title, description, colors, prefix }) {
  if (!description && !getCustomizedAttireColors(colors).length) return null;

  return (
    <div className="inv-attire-block">
      {title && <h4>{title}</h4>}
      {description && <p>{description}</p>}
      <AttireColorSwatches colors={colors} prefix={prefix} />
    </div>
  );
}

export default function AttireGuideSection({ attire = {}, dressCode }) {
  const effectiveDressCode = dressCode || attire.dress_code || 'Formal Filipino';
  const colorGuideNote = 'To honor our wedding party and family, we have assigned specific colors for each group.';

  return (
    <section className="inv-section inv-attire-section" id="attire">
      <p className="inv-script-title inv-script-title-small">What To Wear</p>
      <div className="inv-divider" />

      <div className="inv-attire-stack">
        <div className="inv-attire-header-block">
          <p className="inv-attire-dresscode">
            Attire: <strong>{effectiveDressCode}</strong>
          </p>
          <p className="inv-attire-general-note">{colorGuideNote}</p>
        </div>

        <div className="inv-attire-guide-card">
          {/* Gentlemen's Pants */}
          <div className="inv-attire-group-box">
            <h5 className="inv-attire-group-title" style={{ color: 'var(--inv-primary)' }}>Gentlemen’s Pants</h5>
            <div className="inv-attire-group-list">
              {GENTLEMEN_PANTS_COLOR_GUIDE.map((item, idx) => (
                <div key={idx} className="inv-attire-guide-item">
                  <div className="inv-attire-guide-item-info">
                    <strong className="inv-attire-role">{item.role}:</strong>{' '}
                    <span className="inv-attire-color-label">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ladies' Gowns */}
          <div className="inv-attire-group-box" style={{ marginTop: 20 }}>
            <h5 className="inv-attire-group-title" style={{ color: 'var(--inv-primary)' }}>Ladies’ Gowns</h5>
            <div className="inv-attire-group-list">
              {LADIES_GOWNS_COLOR_GUIDE.map((item, idx) => (
                <div key={idx} className="inv-attire-guide-item">
                  <div className="inv-attire-guide-item-info">
                    <strong className="inv-attire-role">{item.role}:</strong>{' '}
                    <span className="inv-attire-color-label">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
