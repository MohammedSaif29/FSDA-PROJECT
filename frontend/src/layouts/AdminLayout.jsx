import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Grid, Download, Bookmark, MessageSquare, Sparkles, Shield, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getUser, logout } from '../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout = () => {
  const user = getUser();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="admin-layout">
      <div
        className={`admin-sidebar-backdrop ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
      />

      <aside className={`admin-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="admin-mobile-close">
          <button
            type="button"
            className="admin-mobile-icon-btn"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-brand">
          <div className="admin-logo-icon">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <span className="admin-brand-text">EduResource</span>
            <p className="admin-brand-caption">Command Center</p>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/categories" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Grid size={20} />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/admin/downloads" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Download size={20} />
            <span>My Downloads</span>
          </NavLink>
          <NavLink to="/admin/saved" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Bookmark size={20} />
            <span>Saved Resources</span>
          </NavLink>
          <NavLink to="/admin/feedback" onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Feedback</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-highlight">
          <div className="admin-highlight-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="admin-highlight-title">Live analytics</p>
            <p className="admin-highlight-text">Track downloads, category interest, and admin activity from one view.</p>
          </div>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              <User size={20} />
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.username || 'Admin User'}</span>
              <span className="admin-user-role">{user?.role || 'ADMIN'}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-mobile-row">
            <button
              type="button"
              className="admin-mobile-icon-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <div>
              <p className="admin-header-kicker">Admin workspace</p>
              <h1 className="admin-header-title">Resource intelligence dashboard</h1>
            </div>
          </div>

          <div>
            <p className="admin-header-kicker admin-header-kicker-desktop">Admin workspace</p>
            <h1 className="admin-header-title admin-header-title-desktop">Resource intelligence dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <div className="admin-status-pill">
              <Shield size={16} />
              <span>Secure session</span>
            </div>
            <button className="admin-header-logout-btn" onClick={logout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
