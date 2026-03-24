import { useState } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { getUser } from '../../hooks/useAuth';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const user = getUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const toggleTheme = () => {
    const nextTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-slate-900/70 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            placeholder="Search resources..."
          />
        </form>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-200">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/30">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
          <div className="hidden min-w-[120px] flex-col md:flex">
            <span className="font-semibold text-white">{user?.username || 'Guest'}</span>
            <span className="text-slate-400">{user?.role || 'Member'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
