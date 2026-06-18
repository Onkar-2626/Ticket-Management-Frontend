import React from 'react';

type BadgeVariant = 
  | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  | 'Pending' | 'Confirmed' | 'Cancelled'
  | 'Paid' | 'Unpaid' | 'Refunded';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const getColors = (v: BadgeVariant) => {
    switch (v) {
      case 'success':
      case 'Confirmed':
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'warning':
      case 'Pending':
      case 'Refunded':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'danger':
      case 'Cancelled':
      case 'Unpaid':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'info':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-dark-800 dark:text-dark-400 border border-slate-200 dark:border-dark-750';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none ${getColors(
        variant
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {children}
    </span>
  );
};

export default Badge;
