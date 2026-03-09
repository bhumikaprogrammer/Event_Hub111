import React from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  ...rest
}) => {
  return (
    <label className="block text-sm font-medium">
      {label && <span className="mb-1 block text-gray-700 dark:text-gray-300">{label}</span>}
      <div
        className={cn(
          'relative flex items-center rounded-xl border-2 bg-white dark:bg-gray-800 transition',
          error ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500',
          'focus-within:ring-4 focus-within:ring-primary-200 dark:focus-within:ring-primary-900',
          className
        )}
      >
        {leftIcon && <span className="pl-3 text-gray-400 dark:text-gray-500 flex items-center">{leftIcon}</span>}
        <input
          className={cn('w-full bg-transparent outline-none px-3 py-2 text-sm rounded-xl text-gray-900 dark:text-gray-100', leftIcon ? 'pl-2' : false, rightIcon ? 'pr-2' : false)}
          {...rest}
        />
        {rightIcon && <span className="pr-3 text-gray-400 dark:text-gray-500 flex items-center">{rightIcon}</span>}
      </div>
      {error ? (
        <span className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{error}</span>
      ) : hint ? (
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</span>
      ) : null}
    </label>
  );
};
