import React from 'react';
import { cn } from '../../lib/cn';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Option[];
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
      {label && <span className="mb-1 block text-gray-700">{label}</span>}
      <select
        className={cn(
          'input-base appearance-none bg-white pr-8',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...rest}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="pointer-events-none -mt-8 ml-[calc(100%-2.5rem)] flex h-8 items-center justify-center text-gray-400">
        ▾
      </span>
      {error ? (
        <span className="mt-1 text-xs text-red-600 font-medium">{error}</span>
      ) : hint ? (
        <span className="mt-1 text-xs text-gray-500">{hint}</span>
      ) : null}
    </label>
  );
};
