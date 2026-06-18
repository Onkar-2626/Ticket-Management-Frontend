import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 border border-transparent',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-dark-800 dark:hover:bg-dark-750 dark:text-slate-100 border border-transparent',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-md shadow-red-500/10 border border-transparent',
    outline: 'border border-slate-300 hover:border-brand-500 text-slate-700 hover:text-brand-600 dark:border-dark-700 dark:hover:border-brand-500 dark:text-slate-200 dark:hover:text-brand-400 bg-transparent',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-dark-850 dark:hover:text-white bg-transparent',
    glass: 'glass-panel hover:bg-white/80 dark:hover:bg-slate-900/60 text-slate-800 dark:text-slate-100 border border-white/20 dark:border-white/5',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98, y: 0 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <Loader size="sm" variant="dots" className="mr-2" />
      ) : icon ? (
        <span className="mr-2 inline-flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
