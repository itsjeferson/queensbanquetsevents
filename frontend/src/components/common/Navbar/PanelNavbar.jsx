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

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
    </svg>
  );
}

export default function PanelNavbar({
  onMenuToggle,
  menuOpen = false,
  unreadCount = 0,
  onOpenNotifications,
}) {
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
        <img src="/assets/images/logo.png" alt="Queen's Banquet Events" className="panel-navbar-logo" />
        <span className="panel-navbar-brand-text">
          <span className="panel-navbar-name">Queen&apos;s Banquet</span>
          <span className="panel-navbar-tagline">Events Management</span>
        </span>
      </div>
      {onOpenNotifications && (
        <div className="panel-navbar-actions">
          <button
            type="button"
            className={`panel-navbar-bell${unreadCount > 0 ? ' panel-navbar-bell--unread' : ''}`}
            onClick={onOpenNotifications}
            aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Open notifications'}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="panel-navbar-badge" aria-hidden="true">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
