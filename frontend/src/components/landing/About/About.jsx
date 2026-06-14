const team = [
  { avatar: '👩‍💼', name: 'Isabella Santos', role: 'Founder & CEO' },
  { avatar: '👨‍🎨', name: 'Miguel Cruz', role: 'Creative Director' },
  { avatar: '👩‍🍳', name: 'Clara Reyes', role: 'Head of Catering' },
];

const stats = [
  { value: '500+', label: 'Events Completed' },
  { value: '12+', label: 'Years Experience' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '30+', label: 'Team Members' },
];

export default function About() {
  return (
    <>
      <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--beige)' }}>
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="section-tag">Our Story</div>
          <h1 className="section-title">More Than Events,<br />We Create <em>Memories</em></h1>
          <span className="gold-line" />
        </div>
      </div>
      <div className="section">
        <div className="about-grid">
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>
              Founded in 2012, Velura Events began with a simple belief: every celebration, no matter the scale, deserves meticulous attention and genuine passion. From a small team of three, we&apos;ve grown into a premier event management company serving Metro Manila and beyond.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>
              Our philosophy is rooted in personalization. We don&apos;t just execute events — we listen, understand, and translate your unique story into an experience your guests will talk about for years.
            </p>
            <div className="about-stats-grid">
              {stats.map((s) => (
                <div key={s.label} style={{ background: 'var(--beige)', borderRadius: 'var(--radius)', padding: 20 }}>
                  <strong style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: 'var(--gold-dark)' }}>{s.value}</strong>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="about-visual">
            <div className="about-img-block">🌸</div>
            <div className="about-badge">
              <strong>2012</strong>
              <span>EST.</span>
            </div>
          </div>
        </div>
        <hr className="divider" style={{ margin: '60px 0' }} />
        <div className="section-tag">Our People</div>
        <h2 className="section-title">Meet the Team</h2>
        <span className="gold-line" />
        <div className="about-team-grid">
          {team.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-avatar">{member.avatar}</div>
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
