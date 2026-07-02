import { getCustomizedAttireColors } from '../../utils/invitationTheme';

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

export default function AttireGuideSection({ attire, dressCode }) {
  if (!attire && !dressCode) return null;

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

      <div className="inv-attire-stack">
        {dressCode && (
          <p className="inv-attire-dresscode">
            Dress Code: <strong>{dressCode}</strong>
          </p>
        )}

        <AttireBlock
          title="Female Primary Sponsors"
          description={attire?.female_primary_sponsors}
          colors={attire?.female_primary_sponsors_colors}
          prefix="female-sponsors"
        />

        <AttireBlock
          title="Male Primary Sponsors"
          description={attire?.male_primary_sponsors}
          colors={attire?.male_primary_sponsors_colors}
          prefix="male-sponsors"
        />

        {(attire?.ladies || attire?.gentlemen) && (
          <div className="inv-attire-guests">
            <h4 className="inv-attire-guests-heading">Guest</h4>

            <AttireBlock
              title="Ladies"
              description={attire?.ladies}
              colors={attire?.ladies_colors}
              prefix="ladies"
            />

            <AttireBlock
              title="Gentlemen"
              description={attire?.gentlemen}
              colors={attire?.gentlemen_colors}
              prefix="gentlemen"
            />
          </div>
        )}

        {attire?.reminders && (
          <div className="inv-attire-reminders">
            <span>Reminders</span>
            <p>{attire.reminders}</p>
          </div>
        )}
      </div>
    </section>
  );
}
