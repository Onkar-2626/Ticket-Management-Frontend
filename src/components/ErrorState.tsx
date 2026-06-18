import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An Error Occurred',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/5 border border-red-500/25 rounded-2xl max-w-lg mx-auto my-6 space-y-4">
      <div className="p-3.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl inline-flex items-center justify-center">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div>
        <h3 className="text-base font-bold text-red-700 dark:text-red-400">
          {title}
        </h3>
        <p className="text-sm text-red-500/80 dark:text-red-450/80 mt-1 max-w-sm mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/20"
        >
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
