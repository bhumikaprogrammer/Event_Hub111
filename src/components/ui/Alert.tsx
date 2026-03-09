import React from 'react';
import { cn } from '../../lib/cn';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantMap: Record<AlertVariant, { container: string; accent: string }> = {
  success: { container: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800', accent: 'text-green-600 dark:text-green-400' },
  error: { container: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800', accent: 'text-red-600 dark:text-red-400' },
  warning: { container: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800', accent: 'text-yellow-600 dark:text-yellow-400' },
  info: { container: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800', accent: 'text-blue-600 dark:text-blue-400' },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...rest
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border px-4 py-3 flex gap-3 items-start shadow-sm',
        variantMap[variant].container,
        className
      )}
      {...rest}
    >
      <div className={cn('text-sm flex-1')}> 
        {title && <div className={cn('font-semibold mb-1', variantMap[variant].accent)}>{title}</div>}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-xs px-2 py-1 rounded-md hover:bg-white/40 dark:hover:bg-gray-700/40 transition"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};
