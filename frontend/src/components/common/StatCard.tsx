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
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className={`p-3 rounded-lg flex-shrink-0 ${iconBgClass}`}>
          <Icon className={`h-6 w-6 ${iconColorClass}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1 opacity-80">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
