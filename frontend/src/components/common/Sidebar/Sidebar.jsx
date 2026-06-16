import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function Sidebar({ items, footerItem }) {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border-soft)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="profile-avatar"
            style={{
              width: 44,
              height: 44,
              fontSize: 18,
              background: user?.role === 'admin' ? 'var(--black)' : undefined,
            }}
          >
            {user?.initials || 'U'}
          </div>
          <div>
            <strong style={{ fontSize: 14, display: 'block' }}>{user?.name || 'User'}</strong>
            <span style={{ fontSize: 12, color: user?.role === 'admin' ? 'var(--gold-dark)' : 'var(--text-muted)' }}>
              {user?.role === 'admin' ? 'Administrator' : 'Client Account'}
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
            >
              {item.icon && (
                <span className="icon sidebar-icon">
                  <item.icon />
                </span>
              )}
              {item.title}
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
