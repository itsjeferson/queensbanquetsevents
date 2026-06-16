export default function OurStory({ story, gallery = [] }) {
  if (!story?.sections?.length) return null;
  const portraits = gallery.filter((item) => item.image).slice(0, 2);

  return (
    <section className="inv-story-section" id="story">
      <div className="inv-section">
        <p className="inv-script-title">{story.title || 'Our Story'}</p>
        <div className="inv-divider" />
        <p className="inv-story-lead">{story.sections[0]?.content}</p>

        {portraits.length > 0 && (
          <div className="inv-portrait-grid">
            {portraits.map((item, index) => (
              <figure key={index} className="inv-portrait-card">
                <img src={item.image} alt={item.caption || `Portrait ${index + 1}`} />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}

        {story.sections.slice(1).map((section, index) => (
          <div key={index} className="inv-story-block">
            <h3>{section.heading}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
