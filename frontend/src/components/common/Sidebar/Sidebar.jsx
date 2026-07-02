import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { adminRoleLabel } from '../../../utils/roles';

export default function Sidebar({ items, footerItem, isOpen = false, onClose, onNavigate }) {
  const { user } = useAuth();

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar-mobile-header">
        <strong>Menu</strong>
        {onClose && (
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        )}
      </div>
      <div style={{ padding: '0 16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="profile-avatar"
            style={{
              width: 44,
              height: 44,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {user?.role === 'super_admin' ? '★' : (user?.initials || 'U')}
          </div>
          <div>
            <strong style={{ fontSize: 14, display: 'block', color: 'var(--text-inverse)' }}>{user?.name || 'User'}</strong>
            <span style={{ fontSize: 12, color: 'var(--gold-light)' }}>
              {adminRoleLabel(user?.role)}
            </span>
          </div>
        </div>
      </div>
      <div className="sidebar-section" style={{ paddingBottom: footerItem ? 72 : 0 }}>
        {items.map((item) => (
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
              {item.icon && (
                <span className="icon sidebar-icon">
                  <item.icon />
                </span>
              )}
              {item.title}
              {item.badge > 0 && (
                <span className="sidebar-badge">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
            </NavLink>
          )
        ))}
      </div>
      {footerItem && (
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, padding: '0 20px' }}>
          {footerItem}
        </div>
      )}
    </aside>
  );
}
