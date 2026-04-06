import { useEffect, useState } from 'react';
import { Search, Moon, Sun, Bell, Plus } from 'lucide-react';
import { getUser } from '../../hooks/useAuth';
import Modal from '../ui/Modal';
import Upload from '../../pages/Upload';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') !== 'light');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadBadgeCount, setUploadBadgeCount] = useState(0);
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

  // Listen for global uploads to show transient badge/count
  useEffect(() => {
    const handler = (e) => {
      setUploadBadgeCount((c) => c + 1);
      // clear after 6s
      setTimeout(() => setUploadBadgeCount(0), 6000);
    };
    window.addEventListener('resource:uploaded', handler);
    return () => window.removeEventListener('resource:uploaded', handler);
  }, []);

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
          {user && user.role === 'ADMIN' ? (
            <>
              <button
                title="Upload resource"
                className="flex h-9 items-center gap-2 rounded-full border border-[#2a2f45] bg-[#121420] px-3 text-sm text-slate-300 hover:text-white"
                onClick={() => setShowUpload(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
                {uploadBadgeCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-500 text-xs text-white px-2 py-0.5">{uploadBadgeCount}</span>
                )}
              </button>
              <Modal open={showUpload} title="Upload Resource" onClose={() => setShowUpload(false)}>
                <Upload
                  onUploaded={(resource) => {
                    // notify other parts of the app
                    window.dispatchEvent(new CustomEvent('resource:uploaded', { detail: resource }));
                    setShowUpload(false);
                  }}
                />
              </Modal>
            </>
          ) : null}
          
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
