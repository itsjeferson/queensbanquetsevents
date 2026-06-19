export default function QuoteBlock({ quote, source, compact = false }) {
  if (!quote?.trim()) return null;

  return (
    <section className={`inv-quote-block ${compact ? 'inv-quote-block-compact' : ''}`}>
      <p>{quote}</p>
      {source && <strong>{source}</strong>}
    </section>
  );
}
