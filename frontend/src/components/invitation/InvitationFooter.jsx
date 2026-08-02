export default function InvitationFooter({
  eventName,
  shareUrl,
  hideShareButton = false,
  hideRsvpButton = false,
  hideFooter = false,
}) {
  if (hideFooter) return null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: eventName, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleRsvpClick = (event) => {
    event.preventDefault();
    const rsvpSection = document.getElementById('rsvp');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.location.hash = 'rsvp';
  };

  const showButtons = !hideShareButton || !hideRsvpButton;

  return (
    <footer className="inv-footer">
      <h3>Thank You</h3>
      <p>We are honored to celebrate this special day with you.</p>
      {showButtons && (
        <div className="inv-share-btns">
          {!hideShareButton && (
            <button type="button" className="inv-share-btn" onClick={handleShare}>
              Share Invitation
            </button>
          )}
          {!hideRsvpButton && (
            <a href="#rsvp" className="inv-share-btn" onClick={handleRsvpClick}>
              RSVP Now
            </a>
          )}
        </div>
      )}
      <p style={{ marginTop: 32, fontSize: 11, opacity: 0.4 }}>
        Powered by Queen&apos;s Banquet Events
      </p>
    </footer>
  );
}
