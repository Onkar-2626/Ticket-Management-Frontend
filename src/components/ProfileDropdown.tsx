import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-850 transition-all focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-500/10 select-none">
          {getInitials(user.name)}
        </div>
        <span className="text-sm font-medium hidden md:block text-slate-700 dark:text-slate-200">
          {user.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-lg border border-slate-200/50 dark:border-dark-800 py-1.5 z-50 text-left origin-top-right overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-slate-100 dark:border-dark-800/80">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 dark:text-dark-500 mt-1 truncate">
                {user.email}
              </p>
            </div>
            
            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-dark-400 dark:hover:text-white dark:hover:bg-dark-800/50 transition-colors"
              >
                <User className="h-4 w-4 mr-2.5 opacity-70" />
                My Profile
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-dark-400 dark:hover:text-white dark:hover:bg-dark-800/50 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2.5 opacity-70" />
                Dashboard Settings
              </Link>
            </div>

            <div className="border-t border-slate-100 dark:border-dark-800/80 my-1" />

            <div className="py-0.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 mr-2.5 opacity-80" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
