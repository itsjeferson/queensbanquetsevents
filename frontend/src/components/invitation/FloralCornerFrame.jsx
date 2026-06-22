import StdCornerOrnament from './StdCornerOrnament';

export default function FloralCornerFrame({ children, className = '' }) {
  const classes = ['inv-floral-frame', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="inv-floral-corners" aria-hidden="true">
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-tl" />
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-tr" />
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-bl" />
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-br" />
      </div>
      <div className="inv-floral-frame-body">{children}</div>
    </div>
  );
}
