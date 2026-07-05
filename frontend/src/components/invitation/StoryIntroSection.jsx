import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function StoryIntroSection({
  story,
  invitationMessage,
  acceptanceMessage,
  showTitleImage = true,
  showMessages = true,
}) {
  const title = story?.title?.trim();
  const image = story?.image?.trim();
  const imageUrl = image ? resolveMediaUrl(image) : '';
  const inviteText = invitationMessage?.trim();
  const acceptText = acceptanceMessage?.trim();

  const hasTitleBlock = showTitleImage && (title || imageUrl);
  const hasMessageBlock = showMessages && (inviteText || acceptText);

  if (!hasTitleBlock && !hasMessageBlock) return null;

  return (
    <>
      {hasTitleBlock && (
        <section className="inv-story-intro">
          {title && (
            <div className="inv-section inv-story-intro-heading">
              <p className="inv-script-title inv-script-title-small">{title}</p>
            </div>
          )}
          {imageUrl && (
            <figure className="inv-story-photo-hero">
              <img src={imageUrl} alt={title || 'Our story'} />
            </figure>
          )}
        </section>
      )}
      {hasMessageBlock && (
        <section className="inv-section inv-story-intro-messages">
          {inviteText && <p className="inv-story-message">{inviteText}</p>}
          {acceptText && <p className="inv-story-message inv-story-message-soft">{acceptText}</p>}
        </section>
      )}
    </>
  );
}
