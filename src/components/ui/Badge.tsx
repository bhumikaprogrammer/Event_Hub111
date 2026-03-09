import React from 'react';
import { cn } from '../../lib/cn';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantMap: Record<BadgeVariant, string> = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  secondary: 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className, children, ...rest }) => {
  return (
    <span className={cn('badge', variantMap[variant], className)} {...rest}>
      {children}
    </span>
  );
};
