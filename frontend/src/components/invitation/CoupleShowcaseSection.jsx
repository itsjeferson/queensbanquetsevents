export default function CoupleShowcaseSection({ groom, bride }) {
  const groomName = groom?.name?.trim();
  const brideName = bride?.name?.trim();
  if (!groomName && !brideName && !groom?.photo && !bride?.photo) return null;

  const cards = [
    { role: 'The Groom', profile: groom },
    { role: 'The Bride', profile: bride },
  ].filter((item) => item.profile?.name?.trim() || item.profile?.photo);

  return (
    <section className="inv-section inv-couple-showcase">
      <div className="inv-couple-showcase-grid">
        {cards.map(({ role, profile }) => (
          <article key={role} className="inv-couple-card">
            {profile.photo && (
              <img src={profile.photo} alt={profile.name || role} className="inv-couple-card-photo" />
            )}
            {profile.name && <h3><strong>{profile.name}</strong></h3>}
            {profile.parents && <p>{profile.parents}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
