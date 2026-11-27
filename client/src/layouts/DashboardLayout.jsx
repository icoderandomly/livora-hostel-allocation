import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#090807] text-stone-100 flex relative overflow-x-hidden selection:bg-amber-500 selection:text-stone-950">
      {/* Warm Obsidian & Gold Ambient Aurora Orbs */}
      <div className="fixed top-0 left-1/4 w-[28rem] h-[28rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-0 right-10 w-[26rem] h-[26rem] bg-orange-600/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="fixed top-1/2 left-1/2 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 relative z-10">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
