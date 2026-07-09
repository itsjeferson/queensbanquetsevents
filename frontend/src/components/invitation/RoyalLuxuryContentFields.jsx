import MediaField from '../common/MediaField/MediaField';
import { normalizeWeddingProgram } from '../../utils/weddingTimeline';
import ColorSwatchPicker from '../common/ColorInput/ColorSwatchPicker';
import { ATTIRE_SWATCH_DEFAULT } from '../../utils/invitationTheme';

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
        </div>
      </div>
    </>
  );
}
