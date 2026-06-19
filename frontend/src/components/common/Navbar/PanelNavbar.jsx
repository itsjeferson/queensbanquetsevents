function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function PanelNavbar({ onMenuToggle, menuOpen = false }) {
  return (
    <nav className="panel-navbar">
      {onMenuToggle && (
        <button
          type="button"
          className="panel-navbar-menu"
          onClick={onMenuToggle}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      )}
      <div className="panel-navbar-brand">
        <span className="panel-navbar-name">Queen&apos;s Banquet</span>
        <span className="panel-navbar-tagline">Events Management</span>
      </div>
    </nav>
  );
}
