import { useState } from 'react';
import { Search, Moon, Sun, Bell } from 'lucide-react';
import { getUser } from '../../hooks/useAuth';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') !== 'light');
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
    <header className="sticky top-0 z-40 h-20 w-full border-b border-[#1e2336] bg-[#0c0e17]/80 px-6 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-6">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-[#2a2f45] bg-[#121420] py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500 focus:bg-[#1a1c29] focus:ring-1 focus:ring-indigo-500"
            placeholder="Search resources, topics, authors..."
          />
          {/* Quick shortcut hint */}
          <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-[#2a2f45] bg-[#1a1c29] px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:flex">
            <span>⌘</span><span>K</span>
          </div>
        </form>

        <div className="flex items-center gap-4">
          
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2f45] bg-[#121420] text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 border-2 border-[#121420]" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2f45] bg-[#121420] text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="h-6 w-px bg-[#1e2336] mx-1"></div>

          <div className="flex items-center gap-3 pl-1 cursor-pointer group">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{user?.username || 'Guest'}</span>
              <span className="text-xs font-medium text-slate-500">{user?.role || 'Member'}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md shadow-indigo-500/20 ring-2 ring-transparent transition-all group-hover:ring-indigo-500">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}
