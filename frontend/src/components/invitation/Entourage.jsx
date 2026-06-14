const GROUPS = [
  { key: 'principal_sponsors', label: 'Principal Sponsors' },
  { key: 'secondary_sponsors', label: 'Secondary Sponsors' },
  { key: 'best_man', label: 'Best Man', single: true },
  { key: 'maid_of_honor', label: 'Maid of Honor', single: true },
  { key: 'groomsmen', label: 'Groomsmen' },
  { key: 'bridesmaids', label: 'Bridesmaids' },
  { key: 'ring_bearer', label: 'Ring Bearer', single: true },
  { key: 'flower_girl', label: 'Flower Girl', single: true },
];

export default function Entourage({ entourage }) {
  if (!entourage) return null;
  const hasContent = GROUPS.some((g) => entourage[g.key]);
  if (!hasContent) return null;

  return (
    <section className="inv-section" id="entourage">
      <p className="inv-section-tag">With Love</p>
      <h2>Entourage</h2>
      <div className="inv-divider" />
      <div className="inv-entourage-grid">
        {GROUPS.map((group) => {
          const value = entourage[group.key];
          if (!value) return null;
          return (
            <div key={group.key} className="inv-entourage-group">
              <h4>{group.label}</h4>
              {group.single ? (
                <p>{value}</p>
              ) : (
                <ul>
                  {(Array.isArray(value) ? value : [value]).map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
