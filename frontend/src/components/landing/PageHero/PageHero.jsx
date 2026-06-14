export default function PageHero({ tag, title, subtitle }) {
  return (
    <div className="page-hero">
      <div className="page-hero-inner">
        {tag && <div className="section-tag">{tag}</div>}
        <h1 className="section-title">{title}</h1>
        <span className="gold-line" />
        {subtitle && <p style={{ color: 'var(--text-muted)', maxWidth: 540 }}>{subtitle}</p>}
      </div>
    </div>
  );
}
