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
    </div>
  );

  if (embedded) return content;

  return <div className="card-widget">{content}</div>;
}
