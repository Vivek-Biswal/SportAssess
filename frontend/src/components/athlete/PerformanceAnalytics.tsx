import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';
import { AssessmentResult } from '../../types';
import { Activity } from 'lucide-react';
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

interface Props {
  results: AssessmentResult[];
}

export function PerformanceAnalytics({ results }: Props) {
  if (!results || results.length === 0) {
    return (
      <div className="mt-8">
        <SectionHeading title="Performance Analytics" description="Track your progress over time." />
        <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No data available yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">
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
    test: r.testId === 't1' ? 'Vertical Jump' : 'Sit-Ups'
  }));

  // Just a simple heuristic for highest/latest
  const bestScore = Math.max(...sortedResults.map(r => r.score));
  const latestScore = sortedResults[sortedResults.length - 1].score;
  const unit = sortedResults[0].unit;

  return (
    <div className="mt-8 space-y-6">
      <SectionHeading title="Performance Analytics" description="Your assessment history and benchmarks." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary-600 text-white border-primary-700">
            <CardContent className="p-6">
              <p className="text-primary-100 text-sm font-medium mb-1">Latest Assessment</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">{latestScore}</span>
                <span className="text-primary-200 mb-1 font-medium">{unit}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-500/50 flex justify-between items-center text-sm">
                <span className="text-primary-100">Personal Best</span>
                <span className="font-semibold">{bestScore} {unit}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500 font-medium">SAI Benchmark Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-slate-900">
                  {/* Mock benchmark target for demo */}
                  {Math.round(bestScore * 1.15)}
                </span>
                <span className="text-slate-500 text-sm mb-1">{unit}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((latestScore / (bestScore * 1.15)) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                You are {(100 - (latestScore / (bestScore * 1.15)) * 100).toFixed(1)}% away from the next tier.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
