import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { Athlete, AssessmentResult } from '../../types';
import { Activity, Award, Trophy, Timer, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userProfile = await api.getAthleteProfile('a1');
        const userResults = await api.getAthleteResults('a1');
        setAthlete(userProfile);
        setResults(userResults);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  if (!athlete) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {athlete.name}</h1>
          <p className="text-slate-500">Here is your performance overview</p>
        </div>
        <Link to="/assessments">
          <Button>Start New Assessment</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg"><Activity className="text-blue-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overall Score</p>
              <h3 className="text-2xl font-bold text-slate-900">{athlete.overallScore}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg"><TrendingUp className="text-green-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Percentile</p>
              <h3 className="text-2xl font-bold text-slate-900">{athlete.percentile}th</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg"><Trophy className="text-purple-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Current Rank</p>
              <h3 className="text-2xl font-bold text-slate-900">#{athlete.rank}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg"><Award className="text-orange-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Badges Earned</p>
              <h3 className="text-2xl font-bold text-slate-900">{athlete.badges.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="pb-3 px-4">Test</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Score</th>
                  <th className="pb-3 px-4">Verification</th>
                  <th className="pb-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-4 px-4 font-medium text-slate-900">
                      {result.testId === 't1' ? 'Vertical Jump' : 'Sit-Ups'}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {new Date(result.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-slate-900 font-semibold">
                      {result.score} {result.unit}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={result.verificationStatus === 'Verified' ? 'success' : 'warning'}>
                        {result.verificationStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Link to={`/result/${result.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No assessments completed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
