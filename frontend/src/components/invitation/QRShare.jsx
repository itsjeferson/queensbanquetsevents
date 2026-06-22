export default function QRShare({ url, enabled }) {
  if (!enabled || !url) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  return (
    <section className="inv-qr-section">
      <p className="inv-section-tag">Share</p>
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Scan to View</h2>
      <img src={qrUrl} alt="QR Code" />
      <p style={{ fontSize: 12, color: 'var(--text-muted)', wordBreak: 'break-all' }}>{url}</p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Scan this QR code to open the invitation</p>
    </section>
  );
}
