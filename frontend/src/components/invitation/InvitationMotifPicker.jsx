import {
  INVITATION_MOTIFS,
  applyMotifToInvitation,
  getInvitationThemeStyles,
  getMotifById,
} from '../../utils/invitationTheme';
import '../../styles/invitation.css';

export default function InvitationMotifPicker({ invitation, onInvitationChange }) {
  const activeMotif = invitation.color_motif || 'classic-gold';
  const isCustom = activeMotif === 'custom';
  const activeTheme = getMotifById(activeMotif);
  const previewTheme = {
    color_motif: activeMotif,
    primary_color: invitation.primary_color || activeTheme.primary_color,
    secondary_color: invitation.secondary_color || activeTheme.secondary_color,
    background_color: invitation.background_color || activeTheme.background_color,
  };
  const previewStyles = getInvitationThemeStyles(previewTheme);
  const selectedPrimary = previewTheme.primary_color;

  const handleSelectMotif = (motifId) => {
    onInvitationChange(applyMotifToInvitation(invitation, motifId));
  };

  const handleCustomColor = (field, value) => {
    onInvitationChange({
      color_motif: 'custom',
      [field]: value,
    });
  };

  return (
    <div className="card-widget">
      <h3>Color Motif</h3>
      <p className="form-help" style={{ marginTop: 12 }}>
        Choose a palette for your invitation. The theme updates headings, accents, and section colors instantly.
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
            <span className="inv-motif-swatches">
              <span style={{ background: motif.primary_color }} />
              <span style={{ background: motif.secondary_color }} />
              <span style={{ background: motif.accent_colors[2] }} />
            </span>
            <strong>{motif.name}</strong>
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="card-form-stack" style={{ marginTop: 20 }}>
          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <input
                type="color"
                value={invitation.primary_color || getMotifById('classic-gold').primary_color}
                onChange={(e) => handleCustomColor('primary_color', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Background Accent</label>
              <input
                type="color"
                value={invitation.secondary_color || getMotifById('classic-gold').secondary_color}
                onChange={(e) => handleCustomColor('secondary_color', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Page Background</label>
              <input
                type="color"
                value={invitation.background_color || getMotifById('classic-gold').background_color}
                onChange={(e) => handleCustomColor('background_color', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className="invitation-page inv-motif-live-preview"
        style={previewStyles}
      >
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
