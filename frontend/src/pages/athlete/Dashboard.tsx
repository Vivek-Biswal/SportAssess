import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { SectionHeading } from '../../components/common/SectionHeading';
import { PerformanceAnalytics } from '../../components/athlete/PerformanceAnalytics';
import { api } from '../../services/api';
import { Athlete, AssessmentResult } from '../../types';
import { Activity, Award, Trophy, Timer, TrendingUp, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const userProfile = await api.getAthleteProfile(user.id);
        const userResults = await api.getAthleteResults(user.id);
        setAthlete(userProfile);
        setResults(userResults);
        setError(null);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/20 shadow-sm rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400 dark:text-red-500" />
            <h3 className="text-xl font-bold mb-2">Failed to load profile</h3>
            <p className="text-sm font-medium text-red-600/80 dark:text-red-400/80">{error || "Could not retrieve athlete data."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl opacity-40 -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Welcome back, {athlete.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your performance overview is ready.</p>
        </div>
        <Link to="/assessments" className="relative z-10 w-full md:w-auto">
          <Button size="lg" className="w-full md:w-auto shadow-md hover:shadow-lg transition-all bg-slate-900 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-500 border-0 rounded-xl font-semibold px-6 py-6 h-auto text-base">
            Start New Assessment
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Overall Score" 
          value={athlete.overallScore} 
          icon={Activity} 
          iconColorClass="text-blue-600 dark:text-blue-400" 
          iconBgClass="bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800/50" 
        />
        <StatCard 
          title="Percentile" 
          value={`${athlete.percentile}th`} 
          icon={TrendingUp} 
          iconColorClass="text-emerald-600 dark:text-emerald-400" 
          iconBgClass="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50" 
        />
        <StatCard 
          title="Current Rank" 
          value={`#${athlete.rank}`} 
          icon={Trophy} 
          iconColorClass="text-violet-600 dark:text-violet-400" 
          iconBgClass="bg-violet-50 dark:bg-violet-900/30 border-violet-100 dark:border-violet-800/50" 
        />
        <StatCard 
          title="Badges Earned" 
          value={athlete.badges.length} 
          icon={Award} 
          iconColorClass="text-amber-600 dark:text-amber-400" 
          iconBgClass="bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/50" 
        />
      </div>

      <PerformanceAnalytics results={results} />

      {/* Recent Assessments */}
      <div className="pt-2">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Recent Assessments</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Your latest verified test results.</p>
          </div>
          <Link to="/my-assessments">
            <Button variant="ghost" className="text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/30">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <th className="py-5 px-8">Test</th>
                    <th className="py-5 px-6">Date</th>
                    <th className="py-5 px-6">Score</th>
                    <th className="py-5 px-6">Status</th>
                    <th className="py-5 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="py-4 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-slate-50">
                            {(result as any).test?.name || 'Assessment'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {new Date(result.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-slate-900 dark:text-slate-50 font-bold text-lg">{result.score}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-medium text-sm">{result.unit}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {result.verificationStatus === 'Verified' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </div>
                        ) : (
                          <Badge variant="warning" className="shadow-sm">{result.verificationStatus}</Badge>
                        )}
                      </td>
                      <td className="py-4 px-8 text-right">
                        <Link to={`/result/${result.id}`}>
                          <Button variant="ghost" size="sm" className="text-slate-400 dark:text-slate-500 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="inline-flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                          <Activity className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-sm font-medium">No assessments completed yet.</p>
                          <p className="text-xs mt-1">Start an assessment to see your history!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
