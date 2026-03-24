import { NavLink } from 'react-router-dom';
import { Home, Upload, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../../hooks/useAuth';

const navItems = [
  { to: '/home', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resources', label: 'Resources', icon: BookOpen },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ collapsed, toggle }) {
  return (
    <aside className={`flex h-screen flex-col border-r border-white/10 bg-slate-950/70 backdrop-blur-xl ${collapsed ? 'w-20' : 'w-72'} transition-all duration-300`}>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">E</span>
          {!collapsed && <span className="text-lg font-bold text-white">EduVault</span>}
        </div>
        <button onClick={toggle} className="text-slate-300 hover:text-white">
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-indigo-600/35 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4">
        <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30">
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
