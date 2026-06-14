export default function VideoSection({ videos }) {
  if (!videos?.length) return null;

  return (
    <section className="inv-section" id="video">
      <p className="inv-section-tag">Watch</p>
      <h2>Our Video</h2>
      <div className="inv-divider" />
      {videos.map((video, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          {video.title && <p style={{ marginBottom: 12, fontSize: 14, color: 'var(--text-muted)' }}>{video.title}</p>}
          <div className="inv-video-wrap">
            <iframe src={video.url} title={video.title || 'Event video'} allowFullScreen />
          </div>
        </div>
      ))}
    </section>
  );
}
