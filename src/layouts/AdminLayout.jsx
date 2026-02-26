import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Grid, Download, Bookmark, MessageSquare, Search, Settings, User, LogOut } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-logo-icon">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <span className="admin-brand-text">EduResource</span>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
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

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">
                            <User size={20} />
                        </div>
                        <div className="admin-user-details">
                            <span className="admin-user-name">Admin User</span>
                            <span className="admin-user-role">Admin</span>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="admin-main">
                {/* Top Header */}
                <header className="admin-header">
                    <div className="admin-search-container">
                        <Search className="admin-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search resources, authors, topics..."
                            className="admin-search-input"
                        />
                    </div>
                    <div className="admin-header-actions">
                        <button className="admin-icon-btn">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
