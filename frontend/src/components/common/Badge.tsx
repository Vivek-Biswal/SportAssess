import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'neutral';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
<<<<<<< HEAD
    default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    outline: 'border border-border-subtle text-text-primary',
    neutral: 'bg-border-subtle/50 text-text-primary',
=======
    default: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-error-100 text-error-700',
    outline: 'border border-slate-200 text-slate-800',
    neutral: 'bg-slate-100 text-slate-800',
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
