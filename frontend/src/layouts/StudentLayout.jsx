import { Menu, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getUser } from '../hooks/useAuth';
import StudentSidebar from '../components/student/StudentSidebar';

export default function StudentLayout() {
  const user = getUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate('/student/explore', { state: { initialSearch: search } });
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.15),_transparent_30%),#050816] text-slate-100">
      <StudentSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, author, or category..."
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition focus:border-sky-400/40"
              />
            </form>

            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 sm:flex">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <div>
                <p className="text-sm font-medium text-white">Student workspace</p>
                <p className="text-xs text-slate-500">{user?.role || 'STUDENT'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto min-w-0 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
