import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  Grid, 
  Download, 
  Bookmark, 
  MessageSquare, 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Activity
} from 'lucide-react';
import { getUser, logout } from '../../hooks/useAuth';

export default function Sidebar({ collapsed, toggle }) {
  const user = getUser();
  const isAdmin = user?.role === 'ADMIN';

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/resources', icon: BookOpen, label: 'Resources' },
    { to: '/admin/users', icon: User, label: 'Users' },
    { to: '/admin/categories', icon: Grid, label: 'Categories' },
    { to: '/admin/downloads', icon: Download, label: 'My Downloads' },
    { to: '/admin/saved', icon: Bookmark, label: 'Saved Resources' },
  ];

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/explore', icon: Compass, label: 'Explore' },
    { to: '/student/activity', icon: Activity, label: 'My Activity' },
    { to: '/student/saved', icon: Bookmark, label: 'Saved Resources' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className={`relative flex h-screen flex-col border-r border-slate-800/60 bg-slate-950 transition-all duration-300 ease-in-out shrink-0 z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Brand */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">EduResource</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Command Center</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 px-4 py-8 overflow-y-auto w-full">
        {!collapsed && <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Main Menu</div>}
        
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                }`
              }
              title={collapsed ? link.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}

        {/* Analytics Highlight */}
        {!collapsed && isAdmin && (
          <div className="mt-8 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-indigo-500/20 p-1.5">
                <Sparkles size={14} className="text-indigo-400" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Live analytics</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Track downloads, category interest, and admin activity from one view.
            </p>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/60 mt-auto flex flex-col gap-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800">
              <User size={18} className="text-slate-300" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">{user?.username || 'Admin User'}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{user?.role || 'ADMIN'}</span>
            </div>
          </div>
        )}
        
        <button 
          onClick={logout} 
          className={`group flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500 hover:text-white ${collapsed ? 'px-2' : 'w-full'}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={toggle} 
        className="absolute -right-4 top-24 flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 shadow-xl hover:text-white hover:bg-indigo-500 transition-all hidden md:flex"
      >
        {collapsed ? <Menu size={14} /> : <X size={14} />}
      </button>
    </aside>
  );
}
