import React from 'react';
import { cn } from '../../lib/cn';

// Add 'destructive' to the variant list
type AlertVariant = 'success' | 'error' | 'warning' | 'info' | 'destructive';

// Remove title, as it will be handled by a dedicated component
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Add styles for the 'destructive' variant
const variantMap: Record<AlertVariant, { container: string; accent: string }> = {
  success: { container: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800', accent: 'text-green-600 dark:text-green-400' },
  error: { container: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800', accent: 'text-red-600 dark:text-red-400' },
  destructive: { container: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800', accent: 'text-red-600 dark:text-red-400' },
  warning: { container: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800', accent: 'text-yellow-600 dark:text-yellow-400' },
  info: { container: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800', accent: 'text-blue-600 dark:text-blue-400' },
};

// Main Alert component
const Alert: React.FC<AlertProps> = ({
  variant = 'info',
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
      <div className="text-sm flex-1">{children}</div>
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

// New AlertTitle component
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('font-semibold mb-1', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

// New AlertDescription component
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// Export all three components
export { Alert, AlertTitle, AlertDescription };