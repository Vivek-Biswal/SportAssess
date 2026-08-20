import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id: propId, ...props }, ref) => {
    const defaultId = useId();
    const id = propId || defaultId;

    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {error && <span className="text-xs text-error-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
