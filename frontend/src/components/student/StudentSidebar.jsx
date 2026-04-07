import { NavLink } from 'react-router-dom';
import { BookMarked, BookOpen, Compass, LayoutDashboard, LogOut, Sparkles, X } from 'lucide-react';
import { logout, getUser } from '../../hooks/useAuth';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/explore', label: 'Explore', icon: Compass },
  { to: '/student/activity', label: 'My Activity', icon: Sparkles },
  { to: '/student/saved', label: 'Saved Resources', icon: BookMarked },
];

export default function StudentSidebar({ mobileOpen = false, onClose = () => {} }) {
  const user = getUser();
  const containerClasses = mobileOpen
    ? 'fixed inset-y-0 left-0 z-50 flex w-[min(85vw,290px)] translate-x-0 flex-col border-r border-white/10 bg-slate-950/95 px-5 py-6 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:w-[290px] lg:translate-x-0 lg:bg-slate-950/70'
    : 'fixed inset-y-0 left-0 z-50 flex w-[min(85vw,290px)] -translate-x-full flex-col border-r border-white/10 bg-slate-950/95 px-5 py-6 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:w-[290px] lg:translate-x-0 lg:bg-slate-950/70';

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside className={containerClasses}>
        <div className="mb-4 flex items-center justify-end lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      <div className="flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">EduResource</p>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Student Mode</p>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
        <p className="text-sm font-medium text-slate-400">Welcome back</p>
        <p className="mt-2 text-xl font-semibold text-white">{user?.username || 'Student'}</p>
        <p className="mt-2 text-sm text-slate-500">Explore, save, and revisit resources from one clean workspace.</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-white shadow-lg shadow-indigo-950/30'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
      </aside>
    </>
  );
}
