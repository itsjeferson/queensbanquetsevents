import MediaField from '../common/MediaField/MediaField';
import ColorSwatchPicker from '../common/ColorInput/ColorSwatchPicker';
import { MAX_AUDIO_SIZE_MB, MAX_IMAGE_SIZE_MB, MAX_VIDEO_SIZE_MB } from '../../utils/mediaUpload';
import { defaultAttire, defaultColorGuide, defaultEntourage, normalizeWeddingProgram } from '../../utils/invitationContent';
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
  const program = normalizeWeddingProgram(invitation.program);
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

  const folderNames = [];
  gallery.forEach((item) => {
    const name = (item.folder || '').trim();
    if (name && !folderNames.includes(name)) folderNames.push(name);
  });

  const groups = [];
  const uncategorizedIndices = [];
  gallery.forEach((item, index) => {
    if (!(item.folder || '').trim()) uncategorizedIndices.push(index);
  });
  if (uncategorizedIndices.length) groups.push({ folder: '', indices: uncategorizedIndices });
  folderNames.forEach((name) => {
    const indices = [];
    gallery.forEach((item, index) => {
      if ((item.folder || '').trim() === name) indices.push(index);
    });
    groups.push({ folder: name, indices });
  });

  const setGallery = (next) => {
    onInvitationChange({ gallery: next.length ? next : [{ caption: '', image: '' }] });
  };

  const addFolder = () => {
    const base = 'New Folder';
    let name = base;
    let n = 2;
    while (folderNames.includes(name)) {
      name = `${base} ${n}`;
      n += 1;
    }
    setGallery([...gallery, { folder: name, caption: '', image: '' }]);
  };

  const addPhotoSlot = (folder) => {
    const next = [...gallery];
    const slot = { folder: folder || '', caption: '', image: '' };
    let insertAt = next.length;
    for (let i = next.length - 1; i >= 0; i -= 1) {
      if ((next[i].folder || '').trim() === folder) {
        insertAt = i + 1;
        break;
      }
    }
    next.splice(insertAt, 0, slot);
    setGallery(next);
  };

  const removePhotoSlot = (index) => {
    const next = [...gallery];
    next.splice(index, 1);
    setGallery(next);
  };

  const removeFolder = (folder) => {
    const next = gallery.filter((item) => (item.folder || '').trim() !== folder);
    setGallery(next);
  };

  const renameFolder = (folder, newName) => {
    const name = newName.trim();
    const next = gallery.map((item) =>
      (item.folder || '').trim() === folder ? { ...item, folder: name } : item
    );
    setGallery(next);
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
              placeholder={event?.event_name || 'Marko & Alexia'}
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
          label="Couple Logo (replaces initials)"
          value={invitation.couple_logo || ''}
          onChange={(value) => onInvitationChange({ couple_logo: value })}
          placeholder="https://..."
          accept="image/*"
          maxSizeMb={MAX_IMAGE_SIZE_MB}
          onError={onFileError}
          urlHint="Upload or paste a URL for your custom logo. When set, it replaces the initials in the monogram."
        />

        <div className="cover-hero-photos">
          <h4 className="cover-hero-photos-title">Photos</h4>
          <p className="form-help cover-hero-photos-help">
            Cover photo appears before guests open the invitation. Hero photo appears on the full-width banner after opening.
          </p>
          <div className="cover-hero-photos-grid">
            <MediaField
              label="Cover Photo"
              value={invitation.cover_image || ''}
              onChange={(value) => onInvitationChange({ cover_image: value })}
              placeholder="https://..."
              accept="image/*"
              maxSizeMb={MAX_IMAGE_SIZE_MB}
              onError={onFileError}
              urlHint="Shown on the cover screen. Paste a URL or upload a file."
              previewVariant="banner"
            />
            <MediaField
              label="Opening Hero Photo"
              value={invitation.opening_hero_image || ''}
              onChange={(value) => onInvitationChange({ opening_hero_image: value })}
              placeholder="https://..."
              accept="image/*"
              maxSizeMb={MAX_IMAGE_SIZE_MB}
              onError={onFileError}
              urlHint="Shown full-width after guests open the invitation."
              previewVariant="banner"
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 10, cursor: 'pointer', fontSize: 12, color: 'var(--text-color, #374151)', lineHeight: 1.4 }}>
                <input
                  type="checkbox"
                  style={{ marginTop: 2, flexShrink: 0, width: 15, height: 15, accentColor: 'var(--primary-color, #6b8f71)' }}
                  checked={Boolean(invitation.hide_hero_text_overlay)}
                  onChange={(e) => onInvitationChange({ hide_hero_text_overlay: e.target.checked })}
                />
                <span>My Opening Hero Photo already includes couple's name & date (hide text overlay)</span>
              </label>
            </MediaField>
            <MediaField
              label="Countdown Background Photo / Video"
              value={invitation.countdown_bg_media || ''}
              onChange={(value) => onInvitationChange({ countdown_bg_media: value })}
              placeholder="https://... (photo or video link)"
              accept="image/*,video/*"
              maxSizeMb={MAX_VIDEO_SIZE_MB}
              onError={onFileError}
              urlHint="Background image or video for the 'Countdown to forever' banner. Upload a file or paste a URL."
              previewVariant="banner"
            />
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label>Countdown Title</label>
            <input
              value={invitation.countdown_title || ''}
              onChange={(e) => onInvitationChange({ countdown_title: e.target.value })}
              placeholder="Countdown to forever:"
            />
          </div>
        </div>
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
          urlHint="Displayed full-width like the hero banner. Paste a URL or upload a file."
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
          <p className="form-help">
            Cover and hero photos are managed in the Cover &amp; Hero section above.
          </p>
          <MediaField
            label="Background Video"
            value={invitation.background_video || ''}
            onChange={(value) => onInvitationChange({ background_video: value })}
            accept=".mp4,video/mp4"
            maxSizeMb={MAX_VIDEO_SIZE_MB}
            onError={onFileError}
            uploadOnly
            importToStorage={false}
            previewVariant=""
            uploadHint="Upload an MP4 file only. Links are not supported for background video."
          />
          <MediaField
            label="Background Music"
            value={invitation.music_url || ''}
            onChange={(value) => onInvitationChange({ music_url: value })}
            accept=".mp3,audio/mpeg,audio/mp3"
            maxSizeMb={MAX_AUDIO_SIZE_MB}
            onError={onFileError}
            uploadOnly
            importToStorage={false}
            previewVariant=""
            uploadHint="Upload an MP3 file only. Links are not supported for background music."
          />

          {/* Music Player Visibility */}
          <div style={{ marginTop: 4 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-color, #374151)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Music Player Visibility
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-color, #374151)', background: !invitation.hide_music_player ? 'rgba(107,143,113,0.1)' : 'transparent', border: `1px solid ${!invitation.hide_music_player ? 'var(--primary-color, #6b8f71)' : '#d1d5db'}`, borderRadius: 8, padding: '8px 14px', transition: 'all 0.15s ease' }}>
                <input
                  type="radio"
                  name="hide_music_player"
                  value="show"
                  checked={!invitation.hide_music_player}
                  onChange={() => onInvitationChange({ hide_music_player: false })}
                  style={{ accentColor: 'var(--primary-color, #6b8f71)' }}
                />
                <span>👁️ Show Player</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-color, #374151)', background: invitation.hide_music_player ? 'rgba(107,143,113,0.1)' : 'transparent', border: `1px solid ${invitation.hide_music_player ? 'var(--primary-color, #6b8f71)' : '#d1d5db'}`, borderRadius: 8, padding: '8px 14px', transition: 'all 0.15s ease' }}>
                <input
                  type="radio"
                  name="hide_music_player"
                  value="hide"
                  checked={Boolean(invitation.hide_music_player)}
                  onChange={() => onInvitationChange({ hide_music_player: true })}
                  style={{ accentColor: 'var(--primary-color, #6b8f71)' }}
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

      <div className="card-widget">
        <div className="card-widget-head">
          <h3>Happy Moments Gallery</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={addFolder}>
            + Add Folder
          </button>
        </div>
        <div className="card-form-stack">
          <p className="form-help">
            Photos appear in the slideshow. Photo 3 is also used as the countdown background.
            Create folders (e.g. Engagement, Pre-Nup Shoot) — each one shows as a filter tab on the
            invitation, and every folder has its own photo slots.
          </p>
          {groups.map((group) => (
            <div key={group.folder ? `folder-${group.indices[0]}` : 'uncategorized'} className="gallery-folder-group">
              <div className="gallery-folder-head">
                {group.folder ? (
                  <input
                    className="gallery-folder-name"
                    value={group.folder}
                    onChange={(e) => renameFolder(group.folder, e.target.value)}
                    placeholder="Folder name"
                  />
                ) : (
                  <span className="gallery-folder-name gallery-folder-static">Without Folder</span>
                )}
                <div className="gallery-folder-actions">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => addPhotoSlot(group.folder)}
                  >
                    Add Photo Slot
                  </button>
                  {group.folder && (
                    <button
                      type="button"
                      className="btn btn-sm gallery-folder-remove"
                      onClick={() => removeFolder(group.folder)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              {group.indices.map((index) => (
                <div key={index} className="gallery-photo-item">
                  <div className="gallery-photo-head">
                    <span className="gallery-photo-index">Photo {index + 1}</span>
                    <button
                      type="button"
                      className="btn btn-sm gallery-folder-remove"
                      onClick={() => removePhotoSlot(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Caption</label>
                    <input
                      value={gallery[index].caption || ''}
                      onChange={(e) => onGalleryChange(index, { caption: e.target.value })}
                      placeholder="Caption"
                    />
                  </div>
                  <MediaField
                    label="Image"
                    value={gallery[index].image || ''}
                    onChange={(value) => onGalleryChange(index, { image: value })}
                    accept="image/*"
                    maxSizeMb={MAX_IMAGE_SIZE_MB}
                    onError={onFileError}
                  />
                </div>
              ))}
            </div>
          ))}
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
          Specify attire details for your wedding party and guests.
        </p>
        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Dress Code</label>
          <input
            value={invitation.dress_code || attire.dress_code || ''}
            onChange={(e) => {
              onInvitationChange({ dress_code: e.target.value });
              onAttireChange('dress_code', e.target.value);
            }}
            placeholder="FORMAL / BARONG"
          />
        </div>

        <p className="inv-settings-field-label" style={{ marginTop: 24, fontWeight: 700 }}>Gentlemen’s Pants</p>
        <div className="form-group" style={{ marginTop: 8 }}>
          <label>Groom</label>
          <input
            value={attire.gentlemen_pants?.groom || ''}
            onChange={(e) => onAttireChange('gentlemen_pants', { ...(attire.gentlemen_pants || {}), groom: e.target.value })}
            placeholder="Dark Brown"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Ninongs</label>
          <input
            value={attire.gentlemen_pants?.ninongs || ''}
            onChange={(e) => onAttireChange('gentlemen_pants', { ...(attire.gentlemen_pants || {}), ninongs: e.target.value })}
            placeholder="Light Brown"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Groomsmen &amp; Secondary Sponsors</label>
          <input
            value={attire.gentlemen_pants?.groomsmen || ''}
            onChange={(e) => onAttireChange('gentlemen_pants', { ...(attire.gentlemen_pants || {}), groomsmen: e.target.value })}
            placeholder="Black"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>All Other Gentlemen</label>
          <input
            value={attire.gentlemen_pants?.other_gentlemen || ''}
            onChange={(e) => onAttireChange('gentlemen_pants', { ...(attire.gentlemen_pants || {}), other_gentlemen: e.target.value })}
            placeholder="Black"
          />
        </div>

        <p className="inv-settings-field-label" style={{ marginTop: 24, fontWeight: 700 }}>Ladies’ Gowns</p>
        <div className="form-group" style={{ marginTop: 8 }}>
          <label>Mothers of the Couple</label>
          <input
            value={attire.ladies_gowns?.mothers || ''}
            onChange={(e) => onAttireChange('ladies_gowns', { ...(attire.ladies_gowns || {}), mothers: e.target.value })}
            placeholder="Beacon Blue"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Ninangs</label>
          <input
            value={attire.ladies_gowns?.ninangs || ''}
            onChange={(e) => onAttireChange('ladies_gowns', { ...(attire.ladies_gowns || {}), ninangs: e.target.value })}
            placeholder="Mid-Blue"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Bridesmaids</label>
          <input
            value={attire.ladies_gowns?.bridesmaids || ''}
            onChange={(e) => onAttireChange('ladies_gowns', { ...(attire.ladies_gowns || {}), bridesmaids: e.target.value })}
            placeholder="Pale Blue or Lime Cream"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>Female Secondary Sponsors</label>
          <input
            value={attire.ladies_gowns?.secondary_sponsors || ''}
            onChange={(e) => onAttireChange('ladies_gowns', { ...(attire.ladies_gowns || {}), secondary_sponsors: e.target.value })}
            placeholder="Titanite Green"
          />
        </div>
        <div className="form-group" style={{ marginTop: 12 }}>
          <label>All Other Ladies</label>
          <input
            value={attire.ladies_gowns?.other_ladies || ''}
            onChange={(e) => onAttireChange('ladies_gowns', { ...(attire.ladies_gowns || {}), other_ladies: e.target.value })}
            placeholder="Light Beige, Warm Taupe, Sage Green, or Espresso"
          />
        </div>

        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Reminders / Note</label>
          <textarea value={attire.reminders || ''} onChange={(e) => onAttireChange('reminders', e.target.value)} />
        </div>
      </div>

      <div className="card-widget">
        <h3>Color Guide</h3>
        <p className="form-help" style={{ marginTop: 12 }}>
          Customize color swatches or upload your own custom Color Guide design image.
        </p>

        <div style={{ marginBottom: 20 }}>
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

      <div className="card-widget">
        <h3>Timeline</h3>
        <p className="form-help" style={{ marginTop: 12 }}>
          Wedding timeline events are fixed. Adjust the time for each part of your day.
        </p>
        <div className="timeline-editor-list">
          {program.map((item, index) => (
            <div key={item.id || index} className="timeline-editor-row">
              <div className="form-group timeline-editor-event">
                <label>Event</label>
                <input readOnly value={item.title} />
              </div>
              <div className="form-group timeline-editor-time">
                <label>Time</label>
                <input
                  value={item.time || ''}
                  onChange={(e) => onProgramChange(index, 'time', e.target.value)}
                  placeholder="3:00 PM"
                />
              </div>
            </div>
          ))}
        </div>
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
