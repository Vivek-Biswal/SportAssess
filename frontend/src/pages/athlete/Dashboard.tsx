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
import { Activity, Award, Trophy, Timer, TrendingUp, AlertCircle } from 'lucide-react';
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
        <Card className="w-full max-w-md border-red-100 bg-red-50">
          <CardContent className="pt-6 text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Failed to load profile</h3>
            <p className="text-sm opacity-80">{error || "Could not retrieve athlete data."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Welcome back, {athlete.name}</h1>
          <p className="text-text-secondary mt-1">Here is your performance overview</p>
        </div>
        <Link to="/assessments">
          <Button size="lg" className="shadow-sm">Start New Assessment</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Overall Score" 
          value={athlete.overallScore} 
          icon={Activity} 
          iconColorClass="text-blue-600 dark:text-blue-400" 
          iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
        />
        <StatCard 
          title="Percentile" 
          value={`${athlete.percentile}th`} 
          icon={TrendingUp} 
          iconColorClass="text-green-600 dark:text-green-400" 
          iconBgClass="bg-green-100 dark:bg-green-900/30" 
        />
        <StatCard 
          title="Current Rank" 
          value={`#${athlete.rank}`} 
          icon={Trophy} 
          iconColorClass="text-purple-600 dark:text-purple-400" 
          iconBgClass="bg-purple-100 dark:bg-purple-900/30" 
        />
        <StatCard 
          title="Badges Earned" 
          value={athlete.badges.length} 
          icon={Award} 
          iconColorClass="text-orange-600 dark:text-orange-400" 
          iconBgClass="bg-orange-100 dark:bg-orange-900/30" 
        />
      </div>

      <PerformanceAnalytics results={results} />

      {/* Recent Assessments */}
      <div className="pt-4">
        <SectionHeading title="Recent Assessments" description="Your latest verified test results." />
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-base/50 border-b border-border-subtle text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    <th className="py-4 px-6">Test</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Score</th>
                    <th className="py-4 px-6">Verification</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-base transition-colors">
                      <td className="py-4 px-6 font-medium text-text-primary">
                        {result.testId === 't1' ? 'Vertical Jump' : 'Sit-Ups'}
                      </td>
                      <td className="py-4 px-6 text-text-secondary">
                        {new Date(result.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-text-primary font-bold">
                        {result.score} <span className="text-text-secondary font-normal text-sm">{result.unit}</span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={result.verificationStatus === 'Verified' ? 'success' : 'warning'}>
                          {result.verificationStatus}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link to={`/result/${result.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20">View Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-text-secondary">
                        No assessments completed yet. Start an assessment to see your history!
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
