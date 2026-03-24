import React from 'react';
import { cn } from '../../lib/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  className,
  ...rest
}) => {
  return (
    <label className="block text-sm font-medium">
      {label && <span className="mb-1 block text-gray-700 dark:text-gray-300">{label}</span>}
      <select
        className={cn(
          'w-full rounded-xl border-2 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none transition text-gray-900 dark:text-gray-100',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-900',
          'focus:ring-4',
          className
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{error}</span>
      ) : hint ? (
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</span>
      ) : null}
    </label>
  );
};