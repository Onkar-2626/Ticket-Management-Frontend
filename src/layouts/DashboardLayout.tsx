import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from '../components/ProfileDropdown';
import ThemeToggle from '../components/ThemeToggle';
import {
  LayoutDashboard,
  Users,
  Ticket,
  CreditCard,
  User,
  PlaneTakeoff,
  Menu,
  X,
  Bell,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Bookings', to: '/bookings', icon: Ticket },
    { name: 'Payments', to: '/payments', icon: CreditCard },
    { name: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-slate-200/50 dark:border-dark-900 bg-white/40 dark:bg-dark-950/20 backdrop-blur-md px-6 py-6 justify-between select-none shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <PlaneTakeoff className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-800 dark:text-white leading-none">
                AeroFlow
              </span>
              <p className="text-[10px] font-bold text-brand-500 tracking-wider uppercase">
                Ticketing
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/15'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-dark-400 dark:hover:text-white dark:hover:bg-dark-900/40'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-3.5 px-4 py-3 text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-xl transition-all cursor-pointer text-left"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 p-6 flex flex-col justify-between"
            >
              <div className="space-y-8">
                {/* Logo & Close */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white">
                      <PlaneTakeoff className="h-5 w-5" />
                    </div>
                    <span className="text-base font-extrabold text-slate-800 dark:text-white">
                      AeroFlow
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                            isActive
                              ? 'bg-brand-600 text-white'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-dark-400 dark:hover:text-white dark:hover:bg-dark-800'
                          }`
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  logout();
                }}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/50 dark:border-dark-900 bg-white/40 dark:bg-dark-950/20 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-500 hover:text-slate-800 dark:text-dark-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <h1 className="text-base md:text-lg font-bold text-slate-850 dark:text-white capitalize truncate">
              {location.pathname.substring(1)}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mock Notification Bell */}
            <div className="relative">
              <button className="p-2 rounded-xl border border-slate-200/60 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-650 dark:text-dark-400 dark:hover:text-white transition-all cursor-pointer relative">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-dark-950" />
              </button>
            </div>
            
            <ThemeToggle />
            
            <div className="h-6 w-px bg-slate-200 dark:bg-dark-800" />
            
            <ProfileDropdown />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 mesh-bg">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
