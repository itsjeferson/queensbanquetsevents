export default function GiftRegistry({ registry }) {
  if (!registry) return null;

  return (
    <section className="inv-section-full" id="gifts">
      <div className="inv-section">
        <p className="inv-section-tag">Gifts</p>
        <h2>Gift Registry</h2>
        <div className="inv-divider" />
        <div className="inv-gift-info">
          {registry.preferences && <p>{registry.preferences}</p>}
          {registry.gcash && <p><strong>GCash:</strong> {registry.gcash}</p>}
          {registry.bank && <p><strong>Bank:</strong> {registry.bank}</p>}
        </div>
      </div>
    </section>
  );
}
