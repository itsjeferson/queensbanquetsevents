import MediaField from '../common/MediaField/MediaField';
import { normalizeWeddingProgram } from '../../utils/weddingTimeline';
import { defaultColorGuide } from '../../utils/invitationContent';
import ColorSwatchPicker from '../common/ColorInput/ColorSwatchPicker';
import { ATTIRE_SWATCH_DEFAULT } from '../../utils/invitationTheme';
import { MAX_IMAGE_SIZE_MB } from '../../utils/mediaUpload';

/**
 * Template-specific content fields for the Royal Luxury (template_id=3) design.
 * Only shows fields that are visible in the botanical two-panel layout.
 */
export default function RoyalLuxuryContentFields({
  invitation,
  event,
  onInvitationChange,
  onVenueChange,
  onProgramChange,
  onFileError,
  onAttireChange,
}) {
  const venue = invitation.venue || {};
  const ceremony = venue.ceremony || {};
  const reception = venue.reception || {};
  const program = normalizeWeddingProgram(invitation.program);

  const updateCeremony = (field, value) => onVenueChange('ceremony', field, value);
  const updateReception = (field, value) => onVenueChange('reception', field, value);

  const updateGiftPreferences = (value) =>
    onInvitationChange({
      gift_registry: { ...(invitation.gift_registry || {}), preferences: value },
    });

  const updateGiftPaymentDetails = (value) =>
    onInvitationChange({
      gift_registry: { ...(invitation.gift_registry || {}), payment_details: value },
    });

  const updateAttireReminders = (value) =>
    onInvitationChange({
      attire: { ...(invitation.attire || {}), reminders: value },
    });

  const updateEntourageField = (field, value) =>
    onInvitationChange({
      entourage: { ...(invitation.entourage || {}), [field]: value },
    });

  const addProgramItem = () => {
    const updated = [...program, { time: '', title: '' }];
    updated.forEach((item, i) => onProgramChange(i, 'time', item.time || ''));
    updated.forEach((item, i) => onProgramChange(i, 'title', item.title || ''));
  };

  const removeProgramItem = (index) => {
    const updated = program.filter((_, i) => i !== index);
    // Re-sync all
    for (let i = 0; i < Math.max(program.length, updated.length); i++) {
      onProgramChange(i, 'time', updated[i]?.time || '');
      onProgramChange(i, 'title', updated[i]?.title || '');
    }
  };

  return (
    <>
      {/* ── Couple Info ──────────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Couple Details</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-row" style={{ marginTop: 20 }}>
          <div className="form-group">
            <label>Couple Display Name</label>
            <input
              value={invitation.couple_display_name || ''}
              onChange={(e) => onInvitationChange({ couple_display_name: e.target.value })}
              placeholder="e.g. Rafaela & Josué"
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              This name appears in large script calligraphy on the invitation.
            </p>
          </div>
          <div className="form-group">
            <label>Couple Initials</label>
            <input
              value={invitation.couple_initials || ''}
              onChange={(e) => onInvitationChange({ couple_initials: e.target.value })}
              placeholder="e.g. R J"
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              Shown in the monogram block (e.g. "R | J"). Use two letters separated by a space.
            </p>
          </div>
        </div>
        <MediaField
          label="Couple Logo (replaces initials)"
          value={invitation.couple_logo || ''}
          onChange={(value) => onInvitationChange({ couple_logo: value })}
          placeholder="https://..."
          accept="image/*"
          maxSizeMb={MAX_IMAGE_SIZE_MB}
          onError={onFileError}
          urlHint="Upload or paste a URL for your custom logo. When set, it replaces the initials in the monogram."
        />
      </div>

      {/* ── Cover Photo ──────────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Cover Photo</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Portrait-style couple photo shown in the left panel. Ideal ratio: 4:5.
          </p>
          <MediaField
            value={invitation.cover_image || ''}
            onChange={(val) => onInvitationChange({ cover_image: val })}
            accept="image/*"
            label="Cover / Portrait Photo"
            onError={onFileError}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <label>Bottom Gallery Photo</label>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Second couple photo shown at the bottom of the right panel.
          </p>
          <MediaField
            value={invitation.gallery?.[0]?.image || ''}
            onChange={(val) => {
              const gallery = [...(invitation.gallery || [{}])];
              gallery[0] = { ...(gallery[0] || {}), image: val };
              onInvitationChange({ gallery });
            }}
            accept="image/*"
            label="Bottom Couple Photo"
            onError={onFileError}
          />
        </div>
      </div>

      {/* ── Quote / Scripture ────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Quote / Scripture</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Quote Text</label>
            <textarea
              rows={3}
              value={invitation.quote || ''}
              onChange={(e) => onInvitationChange({ quote: e.target.value })}
              placeholder="Por encima de todo, vístanse de amor, que es el vínculo perfecto."
            />
          </div>
          <div className="form-group">
            <label>Quote Source</label>
            <input
              value={invitation.quote_source || ''}
              onChange={(e) => onInvitationChange({ quote_source: e.target.value })}
              placeholder="COL 3:14-15"
            />
          </div>
        </div>
      </div>

      {/* ── Parents' Blessing ────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Parents' Blessing</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Blessing Text</label>
          <textarea
            rows={2}
            value={invitation.opening_line || ''}
            onChange={(e) => onInvitationChange({ opening_line: e.target.value })}
            placeholder="Con nuestro amor, la bendición de Dios y la de nuestros padres"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Groom's Parents Names</label>
            <input
              value={invitation.entourage?.groom_parents || ''}
              onChange={(e) => updateEntourageField('groom_parents', e.target.value)}
              placeholder="NOMBRE DE LOS PADRES DEL NOVIO"
            />
          </div>
          <div className="form-group">
            <label>Bride's Parents Names</label>
            <input
              value={invitation.entourage?.bride_parents || ''}
              onChange={(e) => updateEntourageField('bride_parents', e.target.value)}
              placeholder="NOMBRE DE LOS PADRES DE LA NOVIA"
            />
          </div>
        </div>
      </div>

      {/* ── Ceremony Details ─────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Ceremony</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Time</label>
            <input
              value={ceremony.time || ''}
              onChange={(e) => updateCeremony('time', e.target.value)}
              placeholder="5:00 PM"
            />
          </div>
          <div className="form-group">
            <label>Church / Venue Name</label>
            <input
              value={ceremony.name || ''}
              onChange={(e) => updateCeremony('name', e.target.value)}
              placeholder="PARROQUIA SAN MATEO"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <input
              value={ceremony.address || ''}
              onChange={(e) => updateCeremony('address', e.target.value)}
              placeholder="Av. Juan de la Rosa, #Rumaraboque"
            />
          </div>
          <div className="form-group">
            <label>Google Maps URL</label>
            <input
              value={ceremony.map_url || ''}
              onChange={(e) => updateCeremony('map_url', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      </div>

      {/* ── Reception Details ────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Reception</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Time</label>
            <input
              value={reception.time || ''}
              onChange={(e) => updateReception('time', e.target.value)}
              placeholder="6:30 PM"
            />
          </div>
          <div className="form-group">
            <label>Venue Name</label>
            <input
              value={reception.name || ''}
              onChange={(e) => updateReception('name', e.target.value)}
              placeholder="HOTEL LOS TAJIBOS"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <input
              value={reception.address || ''}
              onChange={(e) => updateReception('address', e.target.value)}
              placeholder="Av. Juan de la Rosa, #Rumaraboque"
            />
          </div>
          <div className="form-group">
            <label>Google Maps URL</label>
            <input
              value={reception.map_url || ''}
              onChange={(e) => updateReception('map_url', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      </div>

      {/* ── Itinerary / Program ──────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Itinerary / Activities</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, marginBottom: 16 }}>
          List each activity with a time. These appear as the timeline on the right panel.
        </p>
        {program.map((item, index) => (
          <div key={index} className="form-row" style={{ alignItems: 'center', marginBottom: 10 }}>
            <div className="form-group" style={{ flex: '0 0 130px' }}>
              <label>Time</label>
              <input
                value={item.time || ''}
                onChange={(e) => onProgramChange(index, 'time', e.target.value)}
                placeholder="5:00 PM"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Activity</label>
              <input
                value={item.title || item.event || ''}
                onChange={(e) => onProgramChange(index, 'title', e.target.value)}
                placeholder="Cóctel de bienvenida"
              />
            </div>
            {program.length > 1 && (
              <button
                type="button"
                onClick={() => removeProgramItem(index)}
                style={{
                  background: 'none', border: 'none', color: '#999',
                  cursor: 'pointer', fontSize: 18, padding: '0 6px', alignSelf: 'flex-end',
                  marginBottom: 4,
                }}
                aria-label="Remove activity"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={addProgramItem}
          style={{ marginTop: 4, fontSize: 13 }}
        >
          + Add Activity
        </button>
      </div>

      {/* ── Passes Count ─────────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Reserved Passes</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-group" style={{ marginTop: 16, maxWidth: 160 }}>
          <label>Number of Reserved Seats</label>
          <input
            type="number"
            min={1}
            max={20}
            value={invitation.passes_count || 2}
            onChange={(e) => onInvitationChange({ passes_count: parseInt(e.target.value, 10) || 2 })}
          />
        </div>
      </div>

      {/* ── Gift Registry ────────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Gift Suggestion</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Gift Note</label>
          <textarea
            rows={3}
            value={invitation.gift_registry?.note || ''}
            onChange={(e) => updateGiftNote(e.target.value)}
            placeholder="Si desean hacernos un presente, pueden ayudarnos en nuestro sueño de comprar una casa. ¡Todo suma! LLUVIA DE SOBRES 💌"
          />
        </div>
      </div>

      {/* ── RSVP Note ────────────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>RSVP / Confirmation</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Confirmation Note</label>
          <textarea
            rows={2}
            value={invitation.rsvp_note || ''}
            onChange={(e) => onInvitationChange({ rsvp_note: e.target.value })}
            placeholder="Agradecemos que confirmes tu asistencia antes del 1 de marzo de 2023"
          />
        </div>
      </div>

      {/* ── Adults Only Note ─────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Special Notes</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Adults-Only Note (optional)</label>
          <input
            value={invitation.attire?.reminders || ''}
            onChange={(e) => updateAttireReminders(e.target.value)}
            placeholder="Adoramos a sus hijos, pero creemos que necesitan una noche libre. ¡SOLO ADULTOS, POR FAVOR!"
          />
        </div>
      </div>

      {/* ── Color Guide ─────────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Color Guide</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <p className="form-help" style={{ marginTop: 12 }}>
          Customize color swatches or upload your own custom Color Guide design image.
        </p>

        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <MediaField
            label="Custom Color Guide Design Image (Optional)"
            urlLabel="Image URL"
            placeholder="https://example.com/color-guide-design.png"
            uploadHint="Upload a custom design image for your Color Guide if you prefer an image over circular swatches."
            value={invitation.color_guide_image || ''}
            onChange={(value) => onInvitationChange({ color_guide_image: value })}
            accept="image/*"
            maxSizeMb={MAX_IMAGE_SIZE_MB}
            onError={onFileError}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {(invitation.color_guide || defaultColorGuide()).map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card, #fafafa)', padding: '10px 14px', borderRadius: 8, border: '1px solid #eee' }}>
              <input
                type="color"
                value={item.color || '#091333'}
                onChange={(e) => {
                  const updated = [...(invitation.color_guide || defaultColorGuide())];
                  updated[index] = { ...updated[index], color: e.target.value };
                  onInvitationChange({ color_guide: updated });
                }}
                style={{ width: 44, height: 38, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                title="Pick color"
              />
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => {
                  const updated = [...(invitation.color_guide || defaultColorGuide())];
                  updated[index] = { ...updated[index], name: e.target.value };
                  onInvitationChange({ color_guide: updated });
                }}
                placeholder="Color Name (e.g. MID-BLUE)"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="action-btn danger"
                onClick={() => {
                  const updated = (invitation.color_guide || defaultColorGuide()).filter((_, i) => i !== index);
                  onInvitationChange({ color_guide: updated });
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="action-btn"
            onClick={() => {
              const updated = [...(invitation.color_guide || defaultColorGuide()), { name: 'NEW COLOR', color: '#6184a8' }];
              onInvitationChange({ color_guide: updated });
            }}
          >
            + Add Swatch Color
          </button>
          <button
            type="button"
            className="action-btn outline"
            onClick={() => {
              onInvitationChange({ color_guide: defaultColorGuide() });
            }}
          >
            Reset Default Palette
          </button>
        </div>
      </div>

      {/* ── Background Music ─────────────────────────── */}
      <div className="card-widget">
        <div className="inv-builder-section-header">
          <h3>Background Music</h3>
          <span className="inv-builder-gold-line" style={{ background: '#3E5C44' }} />
        </div>
        <div style={{ marginTop: 16 }}>
          <MediaField
            value={invitation.music_url || ''}
            onChange={(val) => onInvitationChange({ music_url: val })}
            accept="audio/*"
            label="Background Music (MP3)"
            onError={onFileError}
          />

          {/* Music Player Visibility */}
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-color, #374151)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Music Player Visibility
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-color, #374151)', background: !invitation.hide_music_player ? 'rgba(62,92,68,0.1)' : 'transparent', border: `1px solid ${!invitation.hide_music_player ? '#3E5C44' : '#d1d5db'}`, borderRadius: 8, padding: '8px 14px', transition: 'all 0.15s ease' }}>
                <input
                  type="radio"
                  name="hide_music_player_rl"
                  value="show"
                  checked={!invitation.hide_music_player}
                  onChange={() => onInvitationChange({ hide_music_player: false })}
                  style={{ accentColor: '#3E5C44' }}
                />
                <span>👁️ Show Player</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-color, #374151)', background: invitation.hide_music_player ? 'rgba(62,92,68,0.1)' : 'transparent', border: `1px solid ${invitation.hide_music_player ? '#3E5C44' : '#d1d5db'}`, borderRadius: 8, padding: '8px 14px', transition: 'all 0.15s ease' }}>
                <input
                  type="radio"
                  name="hide_music_player_rl"
                  value="hide"
                  checked={Boolean(invitation.hide_music_player)}
                  onChange={() => onInvitationChange({ hide_music_player: true })}
                  style={{ accentColor: '#3E5C44' }}
                />
                <span>🙈 Hide Player</span>
              </label>
            </div>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
              When hidden, guests can still play/pause music from a floating icon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
