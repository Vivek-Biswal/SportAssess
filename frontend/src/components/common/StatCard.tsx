import React from 'react';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  subtitle?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColorClass = 'text-primary-600', 
  iconBgClass = 'bg-primary-50',
  subtitle
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${iconBgClass} opacity-50 dark:opacity-20 blur-2xl`}></div>
      <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <div className={`p-2.5 rounded-xl ${iconBgClass} border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm`}>
            <Icon className={`h-5 w-5 ${iconColorClass}`} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
