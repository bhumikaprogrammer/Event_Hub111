import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  className,
  header,
  footer,
  padding = 'md',
  interactive = false,
  children,
  ...rest
}) => {
  return (
    <div
      className={cn('card-base dark:bg-gray-800 dark:border-gray-700', interactive && 'hover:translate-y-[-2px] transition-transform', className)}
      {...rest}
    >
      {header && (
        <div className={cn('border-b border-gray-100 dark:border-gray-700', padding !== 'none' && 'px-6 py-4')}>
          {header}
        </div>
      )}
      <div className={paddingMap[padding]}>{children}</div>
      {footer && (
        <div className={cn('border-t border-gray-100 dark:border-gray-700', padding !== 'none' && 'px-6 py-4')}>
          {footer}
        </div>
      )}
    </div>
  );
};
