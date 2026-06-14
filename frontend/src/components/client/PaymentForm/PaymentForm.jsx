import Button from '../../common/Button/Button';

export default function PaymentForm({ bookings = [] }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Payment submitted for verification!');
  };

  return (
    <div className="card-widget">
      <h3>Upload Payment Proof</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Booking Reference</label>
          <select>
            {bookings.map((b) => (
              <option key={b.id}>{b.id} — {b.event}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Payment Amount</label>
          <input type="number" placeholder="0.00" required />
        </div>
        <div className="upload-zone">
          <div className="upload-icon">📤</div>
          <div className="upload-text"><strong>Click to upload</strong> or drag & drop<br />PNG, JPG, PDF up to 10MB</div>
        </div>
        <Button type="submit" variant="gold" style={{ width: '100%', marginTop: 16 }}>Submit Payment</Button>
      </form>
    </div>
  );
}
