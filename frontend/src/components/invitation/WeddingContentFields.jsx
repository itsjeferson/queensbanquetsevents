import MediaField from '../common/MediaField/MediaField';
import ColorSwatchPicker from '../common/ColorInput/ColorSwatchPicker';
import { MAX_AUDIO_SIZE_MB, MAX_IMAGE_SIZE_MB, MAX_VIDEO_SIZE_MB } from '../../utils/mediaUpload';
import { defaultAttire, defaultEntourage } from '../../utils/invitationContent';
import { ATTIRE_SWATCH_DEFAULT } from '../../utils/invitationTheme';
import EntourageNameListEditor from './EntourageNameListEditor';
import InvitationMotifPicker from './InvitationMotifPicker';

export default function WeddingContentFields({
  invitation,
  event,
  onInvitationChange,
  onVenueChange,
  onStoryChange,
  onGalleryChange,
  onEntourageChange,
  onAttireChange,
  onProgramChange,
  onFaqChange,
  onFileError,
}) {
  const gallery = invitation.gallery?.length ? invitation.gallery : [{ caption: '', image: '' }];
  const program = invitation.program?.length ? invitation.program : [{ time: '', title: '' }];
  const faqs = invitation.faqs?.length ? invitation.faqs : [{ question: '', answer: '' }];
  const entourage = invitation.entourage || defaultEntourage();
  const attire = invitation.attire || defaultAttire();

  const updateStory = (patch) => onStoryChange({ ...(invitation.story || {}), ...patch });

  const updateEntourage = (patch) => onEntourageChange({ ...entourage, ...patch });

  const updateEntourageNested = (key, subKey, value) => {
    updateEntourage({
      [key]: subKey
        ? { ...(entourage[key] || {}), [subKey]: value }
        : value,
    });
  };

  return (
    <>
      <InvitationMotifPicker invitation={invitation} onInvitationChange={onInvitationChange} />

      <div className="card-widget">
        <h3>Cover & Hero</h3>
        <div className="form-row" style={{ marginTop: 20 }}>
          <div className="form-group">
            <label>Opening Line</label>
            <input
              value={invitation.opening_line || ''}
              onChange={(e) => onInvitationChange({ opening_line: e.target.value })}
              placeholder="With great joy, we invite you"
            />
          </div>
          <div className="form-group">
            <label>Hero Caption</label>
            <input
              value={invitation.hero_caption || ''}
              onChange={(e) => onInvitationChange({ hero_caption: e.target.value })}
              placeholder="In the union of"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Couple Display Name</label>
            <input
              value={invitation.couple_display_name || ''}
              onChange={(e) => onInvitationChange({ couple_display_name: e.target.value })}
              placeholder={event?.event_name || 'Mark & She'}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              Shown on cover and opened hero. Leave blank to use event name.
            </p>
          </div>
          <div className="form-group">
            <label>Couple Initials</label>
            <input
              value={invitation.couple_initials || ''}
              onChange={(e) => onInvitationChange({ couple_initials: e.target.value })}
              placeholder="M&S"
            />
          </div>
        </div>
        <MediaField
          label="Opening Hero Photo (shown after opening invitation)"
          value={invitation.opening_hero_image || ''}
          onChange={(value) => onInvitationChange({ opening_hero_image: value })}
          placeholder="https://..."
          accept="image/*"
          maxSizeMb={MAX_IMAGE_SIZE_MB}
          onError={onFileError}
        />
      </div>

      <div className="card-widget">
        <h3>Quotes & Story</h3>
        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Opening Quote</label>
          <textarea value={invitation.quote || ''} onChange={(e) => onInvitationChange({ quote: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Quote Source</label>
          <input value={invitation.quote_source || ''} onChange={(e) => onInvitationChange({ quote_source: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Story Title</label>
          <input
            value={invitation.story?.title || ''}
            onChange={(e) => updateStory({ title: e.target.value })}
            placeholder="I have finally found you"
          />
        </div>
        <MediaField
          label="Story Photo (under title)"
          value={invitation.story?.image || ''}
          onChange={(value) => updateStory({ image: value })}
          placeholder="https://..."
          accept="image/*"
          maxSizeMb={MAX_IMAGE_SIZE_MB}
          onError={onFileError}
        />
        <div className="form-group">
          <label>Second Quote</label>
          <textarea value={invitation.secondary_quote || ''} onChange={(e) => onInvitationChange({ secondary_quote: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Parent Invitation Message</label>
          <textarea
            value={invitation.story?.invitation_message || ''}
            onChange={(e) => updateStory({ invitation_message: e.target.value })}
            placeholder="Together with our beloved parents..."
          />
        </div>
        <div className="form-group">
          <label>Acceptance Message</label>
          <textarea
            value={invitation.story?.acceptance_message || ''}
            onChange={(e) => updateStory({ acceptance_message: e.target.value })}
            placeholder="May you kindly accept our invitation..."
          />
        </div>
      </div>

      <div className="wedding-media-grid">
        <div className="card-widget">
          <h3>Groom Profile</h3>
          <div className="card-form-stack">
            <div className="form-group">
              <label>Name</label>
              <input
                value={invitation.groom_profile?.name || ''}
                onChange={(e) => onInvitationChange({ groom_profile: { ...(invitation.groom_profile || {}), name: e.target.value } })}
              />
            </div>
            <MediaField
              label="Photo"
              value={invitation.groom_profile?.photo || ''}
              onChange={(value) => onInvitationChange({ groom_profile: { ...(invitation.groom_profile || {}), photo: value } })}
              accept="image/*"
              maxSizeMb={MAX_IMAGE_SIZE_MB}
              onError={onFileError}
            />
            <div className="form-group">
              <label>Parents Line</label>
              <input
                value={invitation.groom_profile?.parents || ''}
                onChange={(e) => onInvitationChange({ groom_profile: { ...(invitation.groom_profile || {}), parents: e.target.value } })}
                placeholder="Son of Mr. and Mrs. ..."
              />
            </div>
          </div>
        </div>

        <div className="card-widget">
          <h3>Bride Profile</h3>
          <div className="card-form-stack">
            <div className="form-group">
              <label>Name</label>
              <input
                value={invitation.bride_profile?.name || ''}
                onChange={(e) => onInvitationChange({ bride_profile: { ...(invitation.bride_profile || {}), name: e.target.value } })}
              />
            </div>
            <MediaField
              label="Photo"
              value={invitation.bride_profile?.photo || ''}
              onChange={(value) => onInvitationChange({ bride_profile: { ...(invitation.bride_profile || {}), photo: value } })}
              accept="image/*"
              maxSizeMb={MAX_IMAGE_SIZE_MB}
              onError={onFileError}
            />
            <div className="form-group">
              <label>Parents Line</label>
              <input
                value={invitation.bride_profile?.parents || ''}
                onChange={(e) => onInvitationChange({ bride_profile: { ...(invitation.bride_profile || {}), parents: e.target.value } })}
                placeholder="Daughter of Mr. and Mrs. ..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-widget">
        <h3>Photos, Music & Video</h3>
        <div className="card-form-stack">
          <MediaField
            label="Cover Photo URL"
            value={invitation.cover_image || ''}
            onChange={(value) => onInvitationChange({ cover_image: value })}
            accept="image/*"
            maxSizeMb={MAX_IMAGE_SIZE_MB}
            onError={onFileError}
          />
          <MediaField
            label="Background Video URL"
            value={invitation.background_video || ''}
            onChange={(value) => onInvitationChange({ background_video: value })}
            accept="video/*"
            maxSizeMb={MAX_VIDEO_SIZE_MB}
            onError={onFileError}
          />
          <MediaField
            label="Music URL"
            value={invitation.music_url || ''}
            onChange={(value) => onInvitationChange({ music_url: value })}
            accept="audio/*"
            maxSizeMb={MAX_AUDIO_SIZE_MB}
            onError={onFileError}
          />
        </div>
      </div>

      <div className="card-widget">
        <h3>Happy Moments Gallery</h3>
        <div className="card-form-stack">
          <p className="form-help">
            Photos appear in the slideshow. Photo 3 is also used as the countdown background.
          </p>
          {gallery.map((item, index) => (
            <div key={index} className="gallery-photo-item">
              <div className="form-group">
                <label>Photo {index + 1} Caption</label>
                <input
                  value={item.caption || ''}
                  onChange={(e) => onGalleryChange(index, { caption: e.target.value })}
                  placeholder="Caption"
                />
              </div>
              <MediaField
                label={`Photo ${index + 1} Image`}
                value={item.image || ''}
                onChange={(value) => onGalleryChange(index, { image: value })}
                accept="image/*"
                maxSizeMb={MAX_IMAGE_SIZE_MB}
                onError={onFileError}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onInvitationChange({ gallery: [...gallery, { caption: '', image: '' }] })}
          >
            Add Photo Slot
          </button>
        </div>
      </div>

      <div className="card-widget">
        <h3>Location Details</h3>
        {['ceremony', 'reception'].map((type) => (
          <div key={type} style={{ marginBottom: 24, marginTop: type === 'ceremony' ? 20 : 0 }}>
            <h4 style={{ textTransform: 'capitalize', marginBottom: 12 }}>{type}</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Venue Name</label>
                <input value={invitation.venue?.[type]?.name || ''} onChange={(e) => onVenueChange(type, 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input value={invitation.venue?.[type]?.time || ''} onChange={(e) => onVenueChange(type, 'time', e.target.value)} placeholder="3:00 PM" />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={invitation.venue?.[type]?.address || ''} onChange={(e) => onVenueChange(type, 'address', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Map URL (See Location link)</label>
              <input value={invitation.venue?.[type]?.map_url || ''} onChange={(e) => onVenueChange(type, 'map_url', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
            <MediaField
              label="Venue Photo"
              urlLabel="Online photo URL"
              placeholder="https://example.com/venue-photo.jpg"
              urlHint="Paste a direct link to an online photo (recommended), or upload a file from your device."
              value={invitation.venue?.[type]?.image || ''}
              onChange={(value) => onVenueChange(type, 'image', value)}
              accept="image/*"
              maxSizeMb={MAX_IMAGE_SIZE_MB}
              onError={onFileError}
            />
          </div>
        ))}
      </div>

      <div className="card-widget">
        <h3>RSVP</h3>
        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Attendance Confirmation Note</label>
          <textarea value={invitation.rsvp_note || ''} onChange={(e) => onInvitationChange({ rsvp_note: e.target.value })} />
        </div>
      </div>

      <div className="card-widget">
        <h3>The Entourage</h3>
        <div className="form-row" style={{ marginTop: 20 }}>
          <div className="form-group">
            <label>Groom Name</label>
            <input value={entourage.groom?.name || ''} onChange={(e) => updateEntourageNested('groom', 'name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bride Name</label>
            <input value={entourage.bride?.name || ''} onChange={(e) => updateEntourageNested('bride', 'name', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Parents of Groom"
            names={entourage.groom?.parents}
            onChange={(names) => updateEntourageNested('groom', 'parents', names)}
          />
          <EntourageNameListEditor
            label="Parents of Bride"
            names={entourage.bride?.parents}
            onChange={(names) => updateEntourageNested('bride', 'parents', names)}
          />
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Male Principal Sponsors"
            names={entourage.principal_sponsors?.male}
            onChange={(names) => updateEntourageNested('principal_sponsors', 'male', names)}
          />
          <EntourageNameListEditor
            label="Female Principal Sponsors"
            names={entourage.principal_sponsors?.female}
            onChange={(names) => updateEntourageNested('principal_sponsors', 'female', names)}
          />
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Best Man / Best Men"
            names={entourage.best_men}
            onChange={(names) => updateEntourage({ best_men: names })}
          />
          <EntourageNameListEditor
            label="Maid of Honor"
            names={entourage.maid_of_honor}
            onChange={(names) => updateEntourage({ maid_of_honor: names })}
          />
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Candle Sponsors"
            names={entourage.secondary_sponsors?.candle}
            onChange={(names) => updateEntourageNested('secondary_sponsors', 'candle', names)}
          />
          <EntourageNameListEditor
            label="Veil Sponsors"
            names={entourage.secondary_sponsors?.veil}
            onChange={(names) => updateEntourageNested('secondary_sponsors', 'veil', names)}
          />
          <EntourageNameListEditor
            label="Cord Sponsors"
            names={entourage.secondary_sponsors?.cord}
            onChange={(names) => updateEntourageNested('secondary_sponsors', 'cord', names)}
          />
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Groomsmen"
            names={entourage.groomsmen}
            onChange={(names) => updateEntourage({ groomsmen: names })}
          />
          <EntourageNameListEditor
            label="Bridesmaids"
            names={entourage.bridesmaids}
            onChange={(names) => updateEntourage({ bridesmaids: names })}
          />
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Bible Bearer"
            names={entourage.bible_bearer}
            onChange={(names) => updateEntourage({ bible_bearer: names })}
          />
          <EntourageNameListEditor
            label="Ring Bearer"
            names={entourage.ring_bearer}
            onChange={(names) => updateEntourage({ ring_bearer: names })}
          />
          <EntourageNameListEditor
            label="Coin Bearer"
            names={entourage.coin_bearer}
            onChange={(names) => updateEntourage({ coin_bearer: names })}
          />
        </div>
        <div className="form-row">
          <EntourageNameListEditor
            label="Flower Girls"
            names={entourage.flower_girls}
            onChange={(names) => updateEntourage({ flower_girls: names })}
          />
        </div>
      </div>

      <div className="card-widget">
        <h3>What To Wear</h3>
        <p className="form-help" style={{ marginTop: 12 }}>
          Color swatches default to white. Only colors you change from white will appear on the invitation.
        </p>
        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Dress Code</label>
          <input value={invitation.dress_code || ''} onChange={(e) => onInvitationChange({ dress_code: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Female Primary Sponsors</label>
          <textarea value={attire.female_primary_sponsors || ''} onChange={(e) => onAttireChange('female_primary_sponsors', e.target.value)} />
        </div>
        <ColorSwatchPicker
          colors={attire.female_primary_sponsors_colors}
          onChange={(colors) => onAttireChange('female_primary_sponsors_colors', colors)}
          labelPrefix="Female Sponsor Color"
          fallback={ATTIRE_SWATCH_DEFAULT}
          count={4}
        />

        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Male Primary Sponsors</label>
          <textarea value={attire.male_primary_sponsors || ''} onChange={(e) => onAttireChange('male_primary_sponsors', e.target.value)} />
        </div>
        <ColorSwatchPicker
          colors={attire.male_primary_sponsors_colors}
          onChange={(colors) => onAttireChange('male_primary_sponsors_colors', colors)}
          labelPrefix="Male Sponsor Color"
          fallback={ATTIRE_SWATCH_DEFAULT}
          count={4}
        />

        <p className="inv-settings-field-label" style={{ marginTop: 28 }}>Guest</p>

        <div className="form-group">
          <label>Ladies</label>
          <textarea value={attire.ladies || ''} onChange={(e) => onAttireChange('ladies', e.target.value)} />
        </div>
        <ColorSwatchPicker
          colors={attire.ladies_colors}
          onChange={(colors) => onAttireChange('ladies_colors', colors)}
          labelPrefix="Ladies Color"
          fallback={ATTIRE_SWATCH_DEFAULT}
          count={4}
        />

        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Gentlemen</label>
          <textarea value={attire.gentlemen || ''} onChange={(e) => onAttireChange('gentlemen', e.target.value)} />
        </div>
        <ColorSwatchPicker
          colors={attire.gentlemen_colors}
          onChange={(colors) => onAttireChange('gentlemen_colors', colors)}
          labelPrefix="Gentlemen Color"
          fallback={ATTIRE_SWATCH_DEFAULT}
          count={4}
        />

        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Reminders</label>
          <textarea value={attire.reminders || ''} onChange={(e) => onAttireChange('reminders', e.target.value)} />
        </div>
      </div>

      <div className="card-widget">
        <h3>Timeline</h3>
        {program.map((item, index) => (
          <div key={index} className="form-row" style={{ marginTop: index === 0 ? 20 : 0 }}>
            <div className="form-group">
              <label>Time</label>
              <input value={item.time || ''} onChange={(e) => onProgramChange(index, 'time', e.target.value)} placeholder="3:00 PM" />
            </div>
            <div className="form-group">
              <label>Event</label>
              <input value={item.title || ''} onChange={(e) => onProgramChange(index, 'title', e.target.value)} placeholder="Wedding Ceremony" />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onInvitationChange({ program: [...program, { time: '', title: '' }] })}
        >
          Add Timeline Item
        </button>
      </div>

      <div className="card-widget">
        <h3>Wedding Gift</h3>
        <div className="card-form-stack">
          <div className="form-group">
            <label>A Note on Gifts</label>
            <textarea
              value={invitation.gift_registry?.preferences || ''}
              onChange={(e) => onInvitationChange({ gift_registry: { ...(invitation.gift_registry || {}), preferences: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <label>Payment Details</label>
            <textarea
              value={invitation.gift_registry?.payment_details || ''}
              onChange={(e) => onInvitationChange({ gift_registry: { ...(invitation.gift_registry || {}), payment_details: e.target.value } })}
              placeholder={'GCash: 0917-123-4567\nBDO: Account Name - 1234-5678'}
              rows={4}
            />
          </div>

          <h4 className="card-subheading">FAQs & Coordinator</h4>

          {faqs.map((faq, index) => (
            <div key={index} className="faq-item-fields">
              <div className="form-group">
                <label>Question {index + 1}</label>
                <input value={faq.question || ''} onChange={(e) => onFaqChange(index, 'question', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Answer</label>
                <textarea value={faq.answer || ''} onChange={(e) => onFaqChange(index, 'answer', e.target.value)} />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onInvitationChange({ faqs: [...faqs, { question: '', answer: '' }] })}
          >
            Add FAQ
          </button>
          <div className="form-group">
            <label>Coordinator</label>
            <input value={invitation.coordinator || ''} onChange={(e) => onInvitationChange({ coordinator: e.target.value })} />
          </div>
        </div>
      </div>
    </>
  );
}
