import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Grid, Download, Bookmark, MessageSquare, Sparkles, Shield, User, LogOut } from 'lucide-react';
import { getUser, logout } from '../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout = () => {
  const user = getUser();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
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
          <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Grid size={20} />
            <span>Categories</span>
          </NavLink>
          <NavLink to="/admin/downloads" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Download size={20} />
            <span>My Downloads</span>
          </NavLink>
          <NavLink to="/admin/saved" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Bookmark size={20} />
            <span>Saved Resources</span>
          </NavLink>
          <NavLink to="/admin/feedback" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
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
          <div>
            <p className="admin-header-kicker">Admin workspace</p>
            <h1 className="admin-header-title">Resource intelligence dashboard</h1>
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
