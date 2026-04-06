import { NavLink } from 'react-router-dom';
import { Home, Upload, User, LogOut, BookOpen, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../../hooks/useAuth';

const navItems = [
  { to: '/home', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/home/resources', label: 'Resources', icon: BookOpen },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/profile', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, toggle }) {
  return (
    <aside className={`relative flex h-screen flex-col border-r border-[#1e2336] bg-[#0c0e17] ${collapsed ? 'w-20' : 'w-[280px]'} transition-all duration-300 ease-in-out`}>
      {/* Brand logo area */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-[#1e2336]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span className="text-xl font-bold tracking-tight text-white">EduVault</span>}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
        {!collapsed && <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Main Menu</div>}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => 
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <Icon className={`h-5 w-5 transition-colors`} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-[#1e2336] mt-auto">
        <button 
          onClick={logout} 
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>

      {/* Collapse Toggle Button - floating */}
      <button 
        onClick={toggle} 
        className="absolute -right-4 top-24 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e2336] bg-[#121420] text-slate-400 shadow-md hover:text-white hover:bg-indigo-500 transition-all"
      >
        {collapsed ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>
    </aside>
  );
}
