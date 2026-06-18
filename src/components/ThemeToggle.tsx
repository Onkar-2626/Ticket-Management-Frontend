import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-slate-200/60 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 hover:text-slate-800 dark:text-dark-400 dark:hover:text-white transition-all cursor-pointer shadow-sm relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ y: theme === 'dark' ? 30 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Sun className="h-4 w-4" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ y: theme === 'light' ? -30 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute top-2.5 left-2.5"
      >
        <Moon className="h-4 w-4" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
