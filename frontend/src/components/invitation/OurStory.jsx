export default function OurStory({ story }) {
  if (!story?.sections?.length) return null;

  return (
    <section className="inv-section-full" id="story">
      <div className="inv-section">
        <p className="inv-section-tag">Our Journey</p>
        <h2>{story.title || 'Our Story'}</h2>
        <div className="inv-divider" />
        {story.sections.map((section, i) => (
          <div key={i} className="inv-story-block">
            <h3>{section.heading}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
