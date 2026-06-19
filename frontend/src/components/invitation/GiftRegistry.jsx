export default function GiftRegistry({ registry }) {
  if (!registry) return null;

  const hasContent = registry.preferences || registry.payment_details || registry.gcash || registry.bank;
  if (!hasContent) return null;

  return (
    <section className="inv-section-full" id="gifts">
      <div className="inv-section">
        <p className="inv-section-tag">Gifts</p>
        <h2>Wedding Gift</h2>
        <div className="inv-divider" />
        <div className="inv-gift-info">
          {registry.preferences && <p>{registry.preferences}</p>}
          {registry.payment_details && (
            <div className="inv-gift-payment">
              <strong>Payment Details</strong>
              <p>{registry.payment_details}</p>
            </div>
          )}
          {!registry.payment_details && registry.gcash && <p><strong>GCash:</strong> {registry.gcash}</p>}
          {!registry.payment_details && registry.bank && <p><strong>Bank:</strong> {registry.bank}</p>}
        </div>
      </div>
    </section>
  );
}
