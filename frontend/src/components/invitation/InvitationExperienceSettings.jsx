import ContentRevealOrderEditor from './ContentRevealOrderEditor';
import MediaField from '../common/MediaField/MediaField';
import { MAX_IMAGE_SIZE_MB } from '../../utils/mediaUpload';
import { getDefaultContentRevealOrder, getVisibleContentRevealOrder } from '../../utils/contentReveal';

export default function InvitationExperienceSettings({
  invitation,
  onChange,
  embedded = false,
  onFileError,
}) {
  const saveTheDateEnabled = Boolean(invitation.save_the_date_enabled);
  const revealMode = invitation.content_reveal_mode === 'gradual' ? 'gradual' : 'full';
  const revealOrder = getVisibleContentRevealOrder(invitation.content_reveal_order, {
    hideRsvp: saveTheDateEnabled,
  });

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
              Guests see the date, couple name, location, photo, and RSVP before the full invitation unlocks.
            </small>
          </span>
        </label>
      </div>

      {saveTheDateEnabled && (
        <>
          <div className="form-group">
            <label>Save the Date heading</label>
            <input
              value={invitation.std_message || ''}
              onChange={(e) => onChange({ std_message: e.target.value })}
              placeholder="Save the Date"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              value={invitation.std_location || ''}
              onChange={(e) => onChange({ std_location: e.target.value })}
              placeholder="San Antonio, Texas"
            />
          </div>
          <MediaField
            label="Couple photo"
            urlLabel="Online photo URL"
            placeholder="https://example.com/couple-photo.jpg"
            urlHint="Paste a direct link to a couple photo, or upload a file from your device."
            value={invitation.std_photo || invitation.std_cover_image || ''}
            onChange={(value) => onChange({ std_photo: value, std_cover_image: value })}
            accept="image/*"
            maxSizeMb={MAX_IMAGE_SIZE_MB}
            onError={onFileError}
          />
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
              onChange={() => onChange({ content_reveal_mode: 'full', content_reveal_order: [] })}
            />
            <span>
              <strong>Show full content at once</strong>
              <small>Every section appears immediately after opening — no scroll fade-in.</small>
            </span>
          </label>
          <label className="inv-settings-radio">
            <input
              type="radio"
              name="content_reveal_mode"
              value="gradual"
              checked={revealMode === 'gradual'}
              onChange={() => onChange({
                content_reveal_mode: 'gradual',
                content_reveal_order: invitation.content_reveal_order?.length
                  ? invitation.content_reveal_order
                  : getDefaultContentRevealOrder({ hideRsvp: saveTheDateEnabled }),
              })}
            />
            <span>
              <strong>Show content gradually</strong>
              <small>Sections fade in as guests scroll. Pick which sections appear and what they see first.</small>
            </span>
          </label>
        </div>
        {revealMode === 'gradual' && (
          <ContentRevealOrderEditor
            order={revealOrder}
            hideRsvp={saveTheDateEnabled}
            onChange={(content_reveal_order) => onChange({ content_reveal_order })}
          />
        )}
      </div>

      {/* Envelope & Seal Styling (Only for templates with interactive envelopes) */}
      {(Number(invitation.template_id) === 2 || Number(invitation.template_id) === 3) && (
        <div className="form-group" style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 24 }}>
          <span className="inv-settings-field-label" style={{ display: 'block', marginBottom: 6 }}>Envelope & Wax Seal Colors</span>
          <p className="form-help" style={{ marginBottom: 16 }}>
            Customize the look of the digital envelope cover presented to guests.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Envelope Color Choice */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>
                Envelope Color
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 10 }}>
                {[
                  { name: 'Default', value: '' },
                  { name: 'Royal Navy', value: '#06090e' },
                  { name: 'Sage Green', value: '#6b8f71' },
                  { name: 'Crimson Red', value: '#520b0b' },
                  { name: 'Champagne Gold', value: '#f3e7c4' },
                  { name: 'Minimalist Gray', value: '#f3f4f6' },
                ].map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c.value || '#e2e8f0',
                      border: (invitation.envelope_color || '') === c.value ? '2px solid #8a6947' : '1px solid #ddd',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}
                    onClick={() => onChange({ envelope_color: c.value })}
                  >
                    {!c.value && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#4a5568', fontWeight: 'bold' }}>Def</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={invitation.envelope_color || '#f3f4f6'}
                  style={{ width: '40px', height: '24px', padding: 0, border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                  onChange={(e) => onChange({ envelope_color: e.target.value })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>Custom color picker</span>
              </div>
            </div>

            {/* Wax Seal Color Choice */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>
                Wax Seal Color
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 10 }}>
                {[
                  { name: 'Default', value: '' },
                  { name: 'Burgundy Red', value: '#851c1c' },
                  { name: 'Classic Gold', value: '#BE9B63' },
                  { name: 'Midnight Charcoal', value: '#111827' },
                  { name: 'Sage Green', value: '#6b8f71' },
                  { name: 'Rose Gold', value: '#b76e79' },
                ].map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c.value || '#e2e8f0',
                      border: (invitation.seal_color || '') === c.value ? '2px solid #8a6947' : '1px solid #ddd',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}
                    onClick={() => onChange({ seal_color: c.value })}
                  >
                    {!c.value && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#4a5568', fontWeight: 'bold' }}>Def</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={invitation.seal_color || '#BE9B63'}
                  style={{ width: '40px', height: '24px', padding: 0, border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                  onChange={(e) => onChange({ seal_color: e.target.value })}
                />
                <span style={{ fontSize: '12px', color: '#666' }}>Custom color picker</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return content;

  return <div className="card-widget">{content}</div>;
}
