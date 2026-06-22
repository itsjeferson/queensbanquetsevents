import {
  INVITATION_MOTIFS,
  PALETTE_COLOR_COUNT,
  PALETTE_COLOR_LABELS,
  PALETTE_DEFAULT_COLOR,
  applyCustomPaletteColors,
  applyMotifToInvitation,
  getFloralThemeColors,
  getInvitationPaletteColors,
  getInvitationThemeStyles,
  getMotifById,
  getMotifPreviewColors,
} from '../../utils/invitationTheme';
import ColorSwatchPicker from '../common/ColorInput/ColorSwatchPicker';
import StdCornerOrnament from './StdCornerOrnament';
import '../../styles/invitation.css';

export default function InvitationMotifPicker({ invitation, onInvitationChange }) {
  const activeMotif = invitation.color_motif || 'classic-gold';
  const isCustom = activeMotif === 'custom';
  const activeTheme = getMotifById(activeMotif);
  const customPalette = getInvitationPaletteColors(invitation, activeTheme);
  const previewTheme = {
    color_motif: activeMotif,
    primary_color: customPalette[0],
    background_color: customPalette[1],
    secondary_color: customPalette[2],
    palette_colors: customPalette,
    attire: invitation.attire,
  };
  const previewStyles = getInvitationThemeStyles(previewTheme);
  const floralTheme = getFloralThemeColors(previewTheme);
  const selectedPrimary = previewTheme.primary_color;

  const handleSelectMotif = (motifId) => {
    onInvitationChange(applyMotifToInvitation(invitation, motifId));
  };

  const handleCustomPaletteChange = (colors) => {
    onInvitationChange(applyCustomPaletteColors(invitation, colors));
  };

  return (
    <div className="card-widget">
      <h3>Color Motif</h3>
      <p className="form-help" style={{ marginTop: 12 }}>
        Choose a palette for your invitation page. Save the Date uses a fixed look and is not affected by these colors.
      </p>

      <div className="inv-motif-grid">
        {INVITATION_MOTIFS.map((motif) => (
          <button
            key={motif.id}
            type="button"
            className={`inv-motif-card ${activeMotif === motif.id ? 'selected' : ''}`}
            style={activeMotif === motif.id ? { borderColor: motif.primary_color } : undefined}
            onClick={() => handleSelectMotif(motif.id)}
          >
            <span className="inv-motif-swatches inv-motif-swatches-6">
              {getMotifPreviewColors(motif).map((color, index) => (
                <span key={`${motif.id}-${index}`} style={{ background: color }} />
              ))}
            </span>
            <strong>{motif.name}</strong>
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="card-form-stack" style={{ marginTop: 20 }}>
          <ColorSwatchPicker
            colors={customPalette}
            onChange={handleCustomPaletteChange}
            labels={PALETTE_COLOR_LABELS}
            fallback={PALETTE_DEFAULT_COLOR}
            count={PALETTE_COLOR_COUNT}
          />
        </div>
      )}

      <div
        className="invitation-page inv-motif-live-preview"
        style={previewStyles}
      >
        <div className="inv-motif-floral-preview" aria-hidden="true">
          <StdCornerOrnament className="inv-motif-floral-sample" floralTheme={floralTheme} />
        </div>
        <p className="inv-section-tag">Preview</p>
        <p className="inv-script-title inv-script-title-small">Your Wedding Heading</p>
        <div className="inv-divider" />
        <div className="inv-motif-live-preview-actions">
          <span className="inv-motif-live-preview-band">Accent section band</span>
          <button type="button" className="btn btn-gold btn-sm">RSVP Button</button>
        </div>
      </div>

      {!isCustom && (
        <div className="inv-motif-preview" style={{ borderColor: selectedPrimary }}>
          <span style={{ background: selectedPrimary }} />
          <div>
            <strong>{activeTheme.name}</strong>
            <p>Primary {selectedPrimary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
