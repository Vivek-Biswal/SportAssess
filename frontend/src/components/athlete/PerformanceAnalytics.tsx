import React from 'react';
import { Card, CardContent } from '../common/Card';
import { AssessmentResult } from '../../types';
import { Activity, TrendingUp, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  results: AssessmentResult[];
}

export function PerformanceAnalytics({ results }: Props) {
  const { theme } = useTheme();
  
  if (!results || results.length === 0) {
    return (
      <div className="pt-2">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Performance Analytics</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track your progress over time.</p>
          </div>
        </div>
        <Card className="bg-slate-50/50 dark:bg-slate-800/30 border-dashed border-2 border-slate-200 dark:border-slate-700/50">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6">
              <Activity className="h-10 w-10 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">No data available yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-medium">
              Take your first assessment to unlock detailed analytics, benchmark comparisons, and trend tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group and sort data by date
  const sortedResults = [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Example formatting for the chart
  const chartData = sortedResults.map(r => ({
    date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: r.score,
    test: (r as any).test?.name || 'Assessment'
  }));

  // Just a simple heuristic for highest/latest
  const bestScore = Math.max(...sortedResults.map(r => r.score));
  const latestScore = sortedResults[sortedResults.length - 1].score;
  const unit = sortedResults[0].unit;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-xl border border-slate-800 dark:border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold">
            {payload[0].value} <span className="text-slate-400 text-sm font-medium">{unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const chartStrokeColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  const gridStrokeColor = theme === 'dark' ? '#334155' : '#f1f5f9';

  return (
    <div className="pt-2">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Performance Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Your assessment history and benchmarks.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg">Score Trends</h3>
            </div>
            <div className="h-72 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartStrokeColor} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={chartStrokeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridStrokeColor} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridStrokeColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke={chartStrokeColor} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    activeDot={{ r: 6, fill: chartStrokeColor, stroke: theme === 'dark' ? '#0f172a' : '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 flex flex-col">
          <Card className="bg-slate-900 dark:bg-primary-900/40 border-0 dark:border dark:border-primary-800/50 text-white rounded-2xl shadow-md relative overflow-hidden flex-grow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-primary-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Activity className="w-4 h-4 text-white dark:text-primary-300" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-white dark:text-primary-300">Latest Result</p>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-5xl font-extrabold tracking-tight text-white dark:text-primary-50">{latestScore}</span>
                  <span className="text-slate-400 dark:text-primary-300 font-medium text-lg">{unit}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 dark:border-primary-800/50 flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-primary-300 font-medium">Personal Best</span>
                <span className="font-bold text-white dark:text-primary-100 bg-white/10 dark:bg-primary-800/50 px-3 py-1 rounded-lg">{bestScore} {unit}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex-grow">
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary-500" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">SAI Benchmark Target</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                    {Math.round(bestScore * 1.15)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{unit}</span>
                </div>
              </div>
              <div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3">
                  <div 
                    className="bg-primary-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((latestScore / (bestScore * 1.15)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  You are <strong className="text-slate-900 dark:text-slate-50">{(100 - (latestScore / (bestScore * 1.15)) * 100).toFixed(1)}%</strong> away from the next tier.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
