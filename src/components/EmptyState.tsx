import React from 'react';
import { Database } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Database className="h-10 w-10 text-slate-350 dark:text-dark-600" />,
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card border border-slate-200/40 rounded-2xl max-w-lg mx-auto my-6 space-y-4">
      <div className="p-4 bg-slate-100 dark:bg-dark-850 rounded-2xl inline-flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        <p className="text-sm text-slate-400 dark:text-dark-500 mt-1 max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {actionText && onActionClick && (
        <Button variant="primary" size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
