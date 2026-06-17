export default function OurStory({ story, gallery = [] }) {
  const sections = (story?.sections || []).filter(
    (section) => section.heading?.trim() || section.content?.trim(),
  );
  if (!sections.length && !story?.title?.trim()) return null;
  const portraits = gallery.filter((item) => item.image).slice(0, 2);

  return (
    <section className="inv-story-section" id="story">
      <div className="inv-section">
        {story?.title && <p className="inv-script-title">{story.title}</p>}
        {story?.title && <div className="inv-divider" />}
        {sections[0]?.content && <p className="inv-story-lead">{sections[0].content}</p>}

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

        {sections.slice(1).map((section, index) => (
          <div key={index} className="inv-story-block">
            {section.heading && <h3>{section.heading}</h3>}
            {section.content && <p>{section.content}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
