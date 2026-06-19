export default function AttireGuideSection({ attire, dressCode }) {
  if (!attire && !dressCode) return null;

  const ladiesColors = Array.isArray(attire?.ladies_colors) ? attire.ladies_colors.filter(Boolean) : [];
  const gentlemenColors = Array.isArray(attire?.gentlemen_colors) ? attire.gentlemen_colors.filter(Boolean) : [];
  const hasContent = dressCode
    || attire?.female_primary_sponsors
    || attire?.male_primary_sponsors
    || attire?.ladies
    || attire?.gentlemen
    || attire?.reminders;

  if (!hasContent) return null;

  return (
    <section className="inv-section inv-attire-section" id="attire">
      <p className="inv-script-title inv-script-title-small">What To Wear</p>
      <div className="inv-divider" />
      {dressCode && <p className="inv-attire-dresscode">Dress Code: <strong>{dressCode}</strong></p>}

      <div className="inv-attire-grid inv-attire-sponsors-grid">
        {attire?.female_primary_sponsors && (
          <div>
            <h4>Female Primary Sponsors</h4>
            <p>{attire.female_primary_sponsors}</p>
          </div>
        )}
        {attire?.male_primary_sponsors && (
          <div>
            <h4>Male Primary Sponsors</h4>
            <p>{attire.male_primary_sponsors}</p>
          </div>
        )}
      </div>

      <div className="inv-attire-guests">
        <h4>Guests</h4>
        {attire?.ladies && (
          <div className="inv-attire-guest-block">
            <span>Ladies</span>
            <p>{attire.ladies}</p>
            {ladiesColors.length > 0 && (
              <div className="inv-color-swatches">
                {ladiesColors.map((color) => (
                  <span key={color} className="inv-color-swatch" style={{ background: color }} title={color} />
                ))}
              </div>
            )}
          </div>
        )}
        {attire?.gentlemen && (
          <div className="inv-attire-guest-block">
            <span>Gentlemen</span>
            <p>{attire.gentlemen}</p>
            {gentlemenColors.length > 0 && (
              <div className="inv-color-swatches">
                {gentlemenColors.map((color) => (
                  <span key={color} className="inv-color-swatch" style={{ background: color }} title={color} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {attire?.reminders && (
        <div className="inv-attire-reminders">
          <span>Reminders</span>
          <p>{attire.reminders}</p>
        </div>
      )}
    </section>
  );
}
