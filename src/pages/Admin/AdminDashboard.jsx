import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Library,
    Users,
    Settings as SettingsIcon
} from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="admin-layout">
            {/* Admin Sidebar */}
            <aside className="admin-sidebar glass-panel">
                <div className="admin-header">
                    <h2>Admin Portal</h2>
                </div>
                <nav className="admin-nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Library size={20} /> Manage Resources
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Users size={20} /> Manage Access
                    </NavLink>
                </nav>
            </aside>

            {/* Admin Main Content Area */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
