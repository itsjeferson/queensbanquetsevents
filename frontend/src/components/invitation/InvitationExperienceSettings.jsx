export default function InvitationExperienceSettings({ invitation, onChange, embedded = false }) {
  const saveTheDateEnabled = Boolean(invitation.save_the_date_enabled);
  const revealMode = invitation.content_reveal_mode === 'gradual' ? 'gradual' : 'full';

  const content = (
    <div className="inv-guest-experience">
      <h3>Guest Experience</h3>
      <p className="form-help" style={{ marginBottom: 20 }}>
        Control how guests first see your invitation and how content appears after they open it.
      </p>

      <div className="form-group">
        <label className="inv-settings-toggle">
          <input
            type="checkbox"
            checked={saveTheDateEnabled}
            onChange={(e) => onChange({ save_the_date_enabled: e.target.checked })}
          />
          <span>
            <strong>Save the Date first</strong>
            <small>
              Guests see couple name, wedding date, countdown, and RSVP before the full invitation unlocks.
            </small>
          </span>
        </label>
      </div>

      {saveTheDateEnabled && (
        <>
          <div className="form-group">
            <label>Tagline (below wreath)</label>
            <input
              value={invitation.std_message || ''}
              onChange={(e) => onChange({ std_message: e.target.value })}
              placeholder="For the wedding of"
            />
          </div>
          <div className="form-group">
            <label>Save the Date cover image URL (optional)</label>
            <input
              value={invitation.std_cover_image || ''}
              onChange={(e) => onChange({ std_cover_image: e.target.value })}
              placeholder="Leave blank to use invitation cover image"
            />
          </div>
          <div className="form-group">
            <label>Location line (optional override)</label>
            <input
              value={invitation.std_location || ''}
              onChange={(e) => onChange({ std_location: e.target.value })}
              placeholder="Leave blank to use Ceremony & Reception venues from invitation"
            />
          </div>
        </>
      )}

      <div className="form-group" style={{ marginTop: 24 }}>
        <span className="inv-settings-field-label">Invitation content display</span>
        <div className="inv-settings-radio-group" role="radiogroup" aria-label="Invitation content display">
          <label className="inv-settings-radio">
            <input
              type="radio"
              name="content_reveal_mode"
              value="full"
              checked={revealMode === 'full'}
              onChange={() => onChange({ content_reveal_mode: 'full' })}
            />
            <span>
              <strong>Show full content at once</strong>
              <small>All sections appear immediately after opening (current default).</small>
            </span>
          </label>
          <label className="inv-settings-radio">
            <input
              type="radio"
              name="content_reveal_mode"
              value="gradual"
              checked={revealMode === 'gradual'}
              onChange={() => onChange({ content_reveal_mode: 'gradual' })}
            />
            <span>
              <strong>Show content gradually</strong>
              <small>Sections fade in one by one as guests scroll.</small>
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return <div className="card-widget">{content}</div>;
}
