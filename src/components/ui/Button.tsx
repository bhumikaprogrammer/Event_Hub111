import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base = 'relative font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 transition disabled:opacity-50 disabled:cursor-not-allowed';
const sizeMap: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
};
const variantMap: Record<ButtonVariant, string> = {
  primary: 'btn-primary shadow-card hover:shadow-card-hover',
  secondary: 'btn-secondary hover:bg-primary-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600',
  outline: 'border-2 border-primary-500 text-primary-600 bg-white dark:bg-gray-800 dark:text-primary-400 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700',
  ghost: 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-green-600 text-white cursor-default',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, loading = false, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(base, sizeMap[size], variantMap[variant], className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          <span className={loading ? 'opacity-0' : ''}>{children}</span>
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          </span>
        )}
      </Comp>
    );
  }
);