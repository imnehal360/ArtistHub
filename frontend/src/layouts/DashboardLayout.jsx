import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Upload,
  Image,
  MessageSquare,
  Bell,
  Settings,
  Menu,
  X,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const { user, isAuthenticated, isArtist } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth Guard: Only artists can access this dashboard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow visitors to access settings page only (or standard dashboard layout has guard for role)
  // Standard dashboard is meant for Artists, let's make sure it handles role redirect appropriately.
  if (user.role !== 'artist' && !location.pathname.endsWith('/settings')) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'artist' },
    { name: 'Upload Artwork', path: '/dashboard/upload', icon: Upload, role: 'artist' },
    { name: 'My Gallery', path: '/dashboard/gallery', icon: Image, role: 'artist' },
    { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare, role: 'artist' },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell, role: 'artist' },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, role: 'any' }
  ];

  const filteredMenuItems = menuItems.filter(item => item.role === 'any' || user.role === item.role);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-brand-950 transition-colors duration-300">
      
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside className="hidden w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-4 md:flex md:flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-slate-800 dark:text-white">
            <Sparkles className="h-5 w-5 text-brand-500" />
            <span>Artist<span className="text-brand-500">Hub</span> Workspace</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {filteredMenuItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/15'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <IconComponent className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-white/5 dark:text-slate-400 dark:hover:bg-slate-800/50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Workspace</span>
        </Link>
      </aside>

      {/* 2. SIDEBAR (MOBILE DRAWERS) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/60">
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="w-64 bg-white dark:bg-slate-900 p-4 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-display text-base font-bold text-slate-800 dark:text-white">
                  <Sparkles className="h-5 w-5 text-brand-500" />
                  <span>Artist<span className="text-brand-500">Hub</span></span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 flex-1">
                {filteredMenuItems.map((item, idx) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold ${
                        isActive ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <IconComponent className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-full p-2 text-slate-600 dark:text-slate-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-semibold text-slate-800 dark:text-white">Dashboard</span>
          <div className="w-8" /> {/* Balance spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
