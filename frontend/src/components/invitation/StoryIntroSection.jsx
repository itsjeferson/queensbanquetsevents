export default function StoryIntroSection({
  story,
  invitationMessage,
  acceptanceMessage,
  showTitleImage = true,
  showMessages = true,
}) {
  const title = story?.title?.trim();
  const image = story?.image?.trim();
  const inviteText = invitationMessage?.trim();
  const acceptText = acceptanceMessage?.trim();

  const hasTitleBlock = showTitleImage && (title || image);
  const hasMessageBlock = showMessages && (inviteText || acceptText);

  if (!hasTitleBlock && !hasMessageBlock) return null;

  return (
    <section className="inv-section inv-story-intro">
      {hasTitleBlock && (
        <>
          {title && <p className="inv-script-title inv-script-title-small">{title}</p>}
          {image && (
            <figure className="inv-story-intro-photo">
              <img src={image} alt={title || 'Our story'} />
            </figure>
          )}
        </>
      )}
      {hasMessageBlock && (
        <>
          {inviteText && <p className="inv-story-message">{inviteText}</p>}
          {acceptText && <p className="inv-story-message inv-story-message-soft">{acceptText}</p>}
        </>
      )}
    </section>
  );
}
