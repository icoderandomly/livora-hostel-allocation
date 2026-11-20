import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 relative z-10">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
