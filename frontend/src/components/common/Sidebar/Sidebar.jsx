import { NavLink } from 'react-router-dom';

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function Sidebar({ items, footerItem, isOpen = false, onClose, onNavigate }) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} aria-label="Main Navigation">
      <div className="sidebar-mobile-header">
        <div className="sidebar-mobile-brand">
          <img src="/assets/images/logo.png" alt="" className="sidebar-mobile-logo" />
          <span className="sidebar-mobile-title">Queen's Banquet</span>
        </div>
        {onClose && (
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close navigation menu">
            <CloseIcon />
          </button>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        <div className="sidebar-section">
          {items.map((item) =>
            item.label ? (
              <div key={item.label} className="sidebar-label">{item.label}</div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
                end={item.end}
                onClick={onNavigate}
              >
                <span className="sidebar-item-active-glow" aria-hidden="true" />
                {item.icon && (
                  <span className="sidebar-icon">
                    <item.icon />
                  </span>
                )}
                <span className="sidebar-item-title">{item.title}</span>
                {item.badge > 0 && (
                  <span className="sidebar-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                )}
              </NavLink>
            )
          )}
        </div>
      </nav>

      {footerItem && (
        <div className="sidebar-footer">
          {footerItem}
        </div>
      )}
    </aside>
  );
}
