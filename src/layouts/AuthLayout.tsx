import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between p-6 overflow-hidden mesh-bg bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full flex items-center justify-between relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
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
        <ThemeToggle />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center my-12 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center relative z-10">
        <p className="text-xs text-slate-400 dark:text-dark-600">
          © {new Date().getFullYear()} AeroFlow Aviation. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
