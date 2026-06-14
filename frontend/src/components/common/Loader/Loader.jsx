export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="empty-state">
      <div className="icon">⏳</div>
      <p>{text}</p>
    </div>
  );
}
