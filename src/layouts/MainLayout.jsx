import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-container min-h-screen bg-[radial-gradient(circle_at_top,_#2d2f59,_#111827_30%,_#06070f_80%)] text-white">
      <Navbar />
      <div className="flex h-[calc(100vh-72px)] overflow-hidden">
        <Sidebar collapsed={collapsed} toggle={() => setCollapsed((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
