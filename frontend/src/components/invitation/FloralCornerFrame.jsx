import StdCornerOrnament from './StdCornerOrnament';
import { useFloralTheme } from './FloralThemeContext';

export default function FloralCornerFrame({ children, className = '', floralTheme: floralThemeProp = null }) {
  const floralThemeContext = useFloralTheme();
  const floralTheme = floralThemeProp || floralThemeContext;
  const classes = ['inv-floral-frame', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="inv-floral-corners" aria-hidden="true">
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-tl" floralTheme={floralTheme} />
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-tr" floralTheme={floralTheme} />
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-bl" floralTheme={floralTheme} />
        <StdCornerOrnament className="inv-floral-corner inv-floral-corner-br" floralTheme={floralTheme} />
      </div>
      <div className="inv-floral-frame-body">{children}</div>
    </div>
  );
}
