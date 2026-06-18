import React from 'react';
import Card from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  loading = false,
}) => {
  return (
    <Card className="flex flex-col relative overflow-hidden" hoverable>
      {/* Decorative top border gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-indigo-600 opacity-80" />
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-wider">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 dark:bg-dark-800 rounded mt-2 animate-pulse" />
          ) : (
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2 select-all">
              {value}
            </h3>
          )}
        </div>
        <div className="p-3 bg-slate-100 dark:bg-dark-850 rounded-xl text-brand-500 dark:text-brand-400 shadow-sm border border-slate-200/20">
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center text-xs font-medium">
          {changeType === 'positive' && (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md mr-1.5">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              {change}
            </span>
          )}
          {changeType === 'negative' && (
            <span className="flex items-center text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md mr-1.5">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              {change}
            </span>
          )}
          {changeType === 'neutral' && (
            <span className="text-slate-400 dark:text-dark-550 mr-1.5 font-semibold">
              {change}
            </span>
          )}
          <span className="text-slate-400 dark:text-dark-500 font-normal">vs last month</span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
