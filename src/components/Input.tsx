import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-500 dark:text-dark-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-dark-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-xl transition-all duration-250 bg-white dark:bg-dark-900 border ${
              error
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-slate-200 dark:border-dark-800 focus:ring-brand-500/20 focus:border-brand-500'
            } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-600 focus:outline-none focus:ring-4 ${
              icon ? 'pl-11' : 'pl-4'
            } pr-4 py-2.5 text-sm ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
