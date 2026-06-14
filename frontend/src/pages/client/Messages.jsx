import Button from '../../components/common/Button/Button';

export default function Messages() {
  return (
    <>
      <div className="dash-header">
        <h1>Messages</h1>
        <p>Communicate with your event coordinator.</p>
      </div>
      <div className="card-widget" style={{ maxWidth: 700 }}>
        <div style={{ border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--beige)', padding: '16px 20px', borderBottom: '1px solid var(--border-soft)' }}>
            <strong>Isabella Santos</strong> — Event Coordinator
          </div>
          <div style={{ padding: 24, height: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="testimonial-avatar" style={{ width: 34, height: 34, fontSize: 13, background: 'var(--black)' }}>IS</div>
              <div style={{ background: 'var(--beige)', borderRadius: '12px 12px 12px 2px', padding: '12px 16px', maxWidth: 320 }}>
                <p style={{ fontSize: 13 }}>Hello Maria! I&apos;m Isabella, your coordinator. I&apos;m so excited to help plan your wedding! 🌹</p>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Nov 1, 2:30 PM</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexDirection: 'row-reverse' }}>
              <div className="profile-avatar" style={{ width: 34, height: 34, fontSize: 13, flexShrink: 0 }}>MS</div>
              <div style={{ background: 'var(--gold)', borderRadius: '12px 12px 2px 12px', padding: '12px 16px', maxWidth: 320 }}>
                <p style={{ fontSize: 13, color: 'var(--white)' }}>Thank you Isabella! We&apos;re so thrilled. When can we schedule a venue visit?</p>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Nov 1, 3:00 PM</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="testimonial-avatar" style={{ width: 34, height: 34, fontSize: 13, background: 'var(--black)' }}>IS</div>
              <div style={{ background: 'var(--beige)', borderRadius: '12px 12px 12px 2px', padding: '12px 16px', maxWidth: 320 }}>
                <p style={{ fontSize: 13 }}>I&apos;d suggest December 10 at 2PM! Does that work for you and James?</p>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Nov 1, 3:15 PM</span>
              </div>
            </div>
          </div>
          <div style={{ padding: 16, borderTop: '1px solid var(--border-soft)', display: 'flex', gap: 12 }}>
            <input type="text" placeholder="Type a message..." style={{ flex: 1 }} />
            <Button variant="gold">Send</Button>
          </div>
        </div>
      </div>
    </>
  );
}
