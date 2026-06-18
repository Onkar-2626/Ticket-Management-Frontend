import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'gradient' | 'dots';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  if (variant === 'gradient') {
    const orbitSizes = {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
    };
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className={`${orbitSizes[size]} rounded-full border-t-2 border-r-2 border-brand-500 border-l-2 border-l-transparent`}
        />
      </div>
    );
  }

  if (variant === 'dots') {
    const dotSizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2.5 h-2.5',
      lg: 'w-4 h-4',
    };
    return (
      <div className={`flex items-center space-x-1.5 justify-center ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className={`${dotSizes[size]} rounded-full bg-brand-500`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-slate-200 dark:border-dark-800 border-t-brand-600 dark:border-t-brand-400 animate-spin`}
      />
    </div>
  );
};

// Shimmer Skeleton Loader Components
export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-dark-800/40 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-24 bg-slate-200 dark:bg-dark-800 rounded-lg" />
        <div className="h-6 w-12 bg-slate-200 dark:bg-dark-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 dark:bg-dark-800 rounded-md" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-dark-800 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-16 bg-slate-200 dark:bg-dark-800 rounded-md" />
        <div className="h-8 w-20 bg-slate-200 dark:bg-dark-800 rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonRow: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-dark-900">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <div className="h-4 bg-slate-200 dark:bg-dark-800 rounded-md w-3/4" />
        </td>
      ))}
    </tr>
  );
};

export default Loader;
