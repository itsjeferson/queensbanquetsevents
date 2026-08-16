import { useState } from 'react';
import ContentRevealOrderEditor from './ContentRevealOrderEditor';
import MediaField from '../common/MediaField/MediaField';
import { MAX_AUDIO_SIZE_MB, MAX_IMAGE_SIZE_MB } from '../../utils/mediaUpload';
import { getDefaultContentRevealOrder, getVisibleContentRevealOrder } from '../../utils/contentReveal';

export default function InvitationExperienceSettings({
  invitation,
  onChange,
  embedded = false,
  onFileError,
  onSavePassword,
}) {
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState('');
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
          <div className="form-group">
            <label>RSVP Deadline</label>
            <input
              value={invitation.std_deadline || ''}
              onChange={(e) => onChange({ std_deadline: e.target.value })}
              placeholder="October 15, 2026"
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
          <MediaField
            label="Save the Date Music"
            urlLabel="Audio URL"
            placeholder="https://example.com/song.mp3"
            urlHint="Background music that plays when guests open Save the Date (after password unlock if enabled)."
            value={invitation.std_music_url || ''}
            onChange={(value) => onChange({ std_music_url: value })}
            accept="audio/*"
            maxSizeMb={MAX_AUDIO_SIZE_MB}
            onError={onFileError}
          />
        </>
      )}

      <div className="form-group" style={{ marginTop: 24 }}>
        <label className="inv-settings-toggle">
          <input
            type="checkbox"
            checked={Boolean(invitation.password_protected)}
            onChange={(e) => {
              const checked = e.target.checked;
              const nextPass = checked ? (invitation.password || '123456') : '';
              onChange({ password_protected: checked, password: nextPass });
              onSavePassword?.({ password_protected: checked, password: nextPass });
            }}
          />
          <span>
            <strong>Password Protection</strong>
            <small>Require guests to enter a password before viewing the invitation.</small>
          </span>
        </label>
      </div>

      {invitation.password_protected && (
        <div className="form-group">
          <label>Invitation Password</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input
              type="text"
              value={invitation.password || ''}
              onChange={(e) => onChange({ password: e.target.value })}
              onBlur={() => {
                if (invitation.password_protected && invitation.password?.trim()) {
                  onSavePassword?.({
                    password_protected: true,
                    password: invitation.password.trim(),
                  });
                }
              }}
              placeholder="Enter a password for your guests"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-gold"
              style={{ whiteSpace: 'nowrap', padding: '10px 20px', fontSize: 13 }}
              disabled={saveStatus === 'saving' || !invitation.password?.trim()}
              onClick={async () => {
                setSaveStatus('saving');
                setSaveError('');
                try {
                  await onSavePassword?.({
                    password_protected: true,
                    password: invitation.password,
                  });
                  setSaveStatus('saved');
                } catch {
                  setSaveError('Could not save password.');
                  setSaveStatus('error');
                }
              }}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Password'}
            </button>
          </div>
          {saveStatus === 'saved' && (
            <p style={{ fontSize: 12, color: 'var(--success, #16a34a)', marginTop: 6 }}>
              Password saved to server.
            </p>
          )}
          {saveError && (
            <p style={{ fontSize: 12, color: '#DC3545', marginTop: 6 }}>
              {saveError}
            </p>
          )}
        </div>
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

      <div className="form-group" style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 24 }}>
        <span className="inv-settings-field-label" style={{ display: 'block', marginBottom: 6 }}>
          Section & Sharing Visibility
        </span>
        <p className="form-help" style={{ marginBottom: 16 }}>
          Choose which sharing features, RSVP forms, or footer components to show or hide for guests.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label className="inv-settings-toggle">
            <input
              type="checkbox"
              checked={Boolean(
                invitation.hide_qr_share ||
                invitation.qr_enabled === false ||
                invitation.qr_enabled === 0 ||
                invitation.qr_enabled === '0' ||
                invitation.qr_enabled === 'false'
              )}
              onChange={(e) => {
                const checked = e.target.checked;
                onChange({ hide_qr_share: checked, qr_enabled: checked ? 0 : 1 });
              }}
            />
            <span>
              <strong>Hide "Scan to View" (QR Code Section)</strong>
              <small>Hides the QR Code and Scan to View section from the invitation.</small>
            </span>
          </label>

          <label className="inv-settings-toggle">
            <input
              type="checkbox"
              checked={Boolean(invitation.hide_share_button)}
              onChange={(e) => onChange({ hide_share_button: e.target.checked })}
            />
            <span>
              <strong>Hide "Share Invitation" Button</strong>
              <small>Hides the Share Invitation button in the Thank You footer.</small>
            </span>
          </label>

          <label className="inv-settings-toggle">
            <input
              type="checkbox"
              checked={Boolean(invitation.hide_rsvp || invitation.hide_rsvp_button)}
              onChange={(e) => onChange({ hide_rsvp: e.target.checked, hide_rsvp_button: e.target.checked })}
            />
            <span>
              <strong>Hide RSVP Form & RSVP Now Button</strong>
              <small>Hides the RSVP submission form and RSVP button from guests.</small>
            </span>
          </label>

          <label className="inv-settings-toggle">
            <input
              type="checkbox"
              checked={Boolean(invitation.hide_footer)}
              onChange={(e) => onChange({ hide_footer: e.target.checked })}
            />
            <span>
              <strong>Hide Thank You Footer Section</strong>
              <small>Hides the entire Thank You footer section at the bottom of the invitation.</small>
            </span>
          </label>
        </div>
      </div>

      {/* Envelope & Seal Styling (Interactive envelope cover) */}
      {(Number(invitation.template_id || 1) >= 1) && (
        <div className="form-group" style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 24 }}>
          <span className="inv-settings-field-label" style={{ display: 'block', marginBottom: 6 }}>Envelope & Wax Seal Colors</span>
          <p className="form-help" style={{ marginBottom: 16 }}>
            Customize the look of the digital envelope cover presented to guests.
          </p>

          {(() => {
            const ENVELOPE_PRESETS = ['', '#06090e', '#6b8f71', '#520b0b', '#f3e7c4', '#f3f4f6'];
            const SEAL_PRESETS = ['', '#851c1c', '#BE9B63', '#111827', '#6b8f71', '#b76e79'];
            const envColor = invitation.envelope_color || '';
            const sealColor = invitation.seal_color || '';
            const isEnvCustom = envColor !== '' && !ENVELOPE_PRESETS.includes(envColor);
            const isSealCustom = sealColor !== '' && !SEAL_PRESETS.includes(sealColor);

            return (
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
                    ].map((c) => {
                      const isSelected = envColor === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          title={c.name}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: c.value || '#e2e8f0',
                            border: isSelected ? '2px solid #8a6947' : '1px solid #ddd',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            position: 'relative',
                          }}
                          onClick={() => onChange({ envelope_color: c.value })}
                        >
                          {!c.value && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#4a5568', fontWeight: 'bold' }}>Def</span>}
                        </button>
                      );
                    })}
                    <label
                      title={isEnvCustom ? `${envColor} (click to change)` : 'Pick a custom color'}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isEnvCustom ? envColor : '#f0f0f0',
                        border: isEnvCustom ? '2px solid #8a6947' : '2px dashed #bbb',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <input
                        type="color"
                        value={isEnvCustom ? envColor : '#f3f4f6'}
                        onChange={(e) => onChange({ envelope_color: e.target.value })}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      />
                      {!isEnvCustom && (
                        <span style={{ fontSize: '9px', color: '#666', fontWeight: 'bold', pointerEvents: 'none' }}>C</span>
                      )}
                    </label>
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
                    ].map((c) => {
                      const isSelected = sealColor === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          title={c.name}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: c.value || '#e2e8f0',
                            border: isSelected ? '2px solid #8a6947' : '1px solid #ddd',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            position: 'relative',
                          }}
                          onClick={() => onChange({ seal_color: c.value })}
                        >
                          {!c.value && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#4a5568', fontWeight: 'bold' }}>Def</span>}
                        </button>
                      );
                    })}
                    <label
                      title={isSealCustom ? `${sealColor} (click to change)` : 'Pick a custom color'}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isSealCustom ? sealColor : '#f0f0f0',
                        border: isSealCustom ? '2px solid #8a6947' : '2px dashed #bbb',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <input
                        type="color"
                        value={isSealCustom ? sealColor : '#BE9B63'}
                        onChange={(e) => onChange({ seal_color: e.target.value })}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      />
                      {!isSealCustom && (
                        <span style={{ fontSize: '9px', color: '#666', fontWeight: 'bold', pointerEvents: 'none' }}>C</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  if (embedded) return content;

  return <div className="card-widget">{content}</div>;
}
