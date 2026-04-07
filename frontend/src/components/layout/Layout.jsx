import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#0c0e17] text-white overflow-hidden">
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
      
      {/* Main Content Pane */}
      <main className="flex-1 h-screen overflow-y-auto w-full relative">
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
