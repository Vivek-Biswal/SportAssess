import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      {description && (
        <p className="text-slate-600 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
