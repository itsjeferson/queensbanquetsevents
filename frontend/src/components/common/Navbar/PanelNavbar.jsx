import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { adminRoleLabel } from '../../../utils/roles';

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function PanelNavbar({
  onMenuToggle,
  menuOpen = false,
  unreadCount = 0,
  onOpenNotifications,
  onLogout,
  settingsPath,
}) {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = user?.initials || user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const userName = user?.name || 'User';
  const userRole = adminRoleLabel(user?.role);

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
      <div className="panel-navbar-actions">
        {onOpenNotifications && (
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
        )}
        <div className="panel-navbar-profile" ref={dropdownRef}>
          <button
            type="button"
            className="panel-navbar-profile-trigger"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <span className="panel-navbar-avatar">{userInitials}</span>
            <span className="panel-navbar-user-info">
              <span className="panel-navbar-user-name">{userName}</span>
              <span className="panel-navbar-user-role">{userRole}</span>
            </span>
            <ChevronDownIcon />
          </button>
          {profileOpen && (
            <div className="panel-navbar-dropdown" role="menu">
              <div className="panel-navbar-dropdown-header">
                <span className="panel-navbar-dropdown-avatar">{userInitials}</span>
                <div className="panel-navbar-dropdown-user">
                  <strong>{userName}</strong>
                  <span>{userRole}</span>
                </div>
              </div>
              <div className="panel-navbar-dropdown-divider" />
              {settingsPath && (
                <a href={`#${settingsPath}`} className="panel-navbar-dropdown-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                  <SettingsIcon />
                  <span>Settings</span>
                </a>
              )}
              <button type="button" className="panel-navbar-dropdown-item panel-navbar-dropdown-item--danger" role="menuitem" onClick={() => { setProfileOpen(false); onLogout?.(); }}>
                <LogoutIcon />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
