import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import PanelNavbar from '../components/common/Navbar/PanelNavbar';
import Sidebar from '../components/common/Sidebar/Sidebar';

export default function DashboardShell({ navItems, footerItem }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', sidebarOpen);
    return () => document.body.classList.remove('sidebar-open');
  }, [sidebarOpen]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 900) setSidebarOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <>
      <PanelNavbar onMenuToggle={toggleSidebar} menuOpen={sidebarOpen} />
      <button
        type="button"
        className={`sidebar-backdrop${sidebarOpen ? ' visible' : ''}`}
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="dashboard-layout">
        <Sidebar
          items={navItems}
          footerItem={footerItem}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={() => setSidebarOpen(false)}
        />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
