import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#05050a] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar on the Left */}
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
      
      {/* Main Content Area on the Right */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Navbar />
        
        {/* Abstract Background for Dashboard */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-8 xl:p-12 z-10 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
