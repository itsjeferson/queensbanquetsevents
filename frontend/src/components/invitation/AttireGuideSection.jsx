export default function AttireGuideSection({ attire = {}, dressCode }) {
  const effectiveDressCode = dressCode || attire.dress_code || 'Formal Filipino';
  const colorGuideNote = 'Kindly join this once in a lifetime celebration by wearing the following';

  return (
    <section className="inv-section inv-attire-section" id="attire">
      <p className="inv-script-title inv-script-title-small">What To Wear</p>
      <div className="inv-divider" />

      <div className="inv-attire-stack">
        <div className="inv-attire-header-block">
          <p className="inv-attire-dresscode">
            Attire: <strong>{effectiveDressCode}</strong>
          </p>
          <p className="inv-attire-general-note">{colorGuideNote}</p>
        </div>

        <div className="inv-attire-reference-grid">
          <figure className="inv-attire-reference">
            <img src="/attire/gentlemen-attire.png" alt="Gentlemen's Attire" loading="lazy" />
            <figcaption>Gentlemen's Attire</figcaption>
          </figure>
          <figure className="inv-attire-reference">
            <img src="/attire/guest-attire.png" alt="Guest Attire" loading="lazy" />
            <figcaption>Guest Attire</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
