import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 w-64 bg-black text-white`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar for mobile */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:hidden shadow-sm bg-white">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-black" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
