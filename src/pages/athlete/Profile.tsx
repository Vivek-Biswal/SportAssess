import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { Athlete } from '../../types';
import { User, MapPin, Activity, Award } from 'lucide-react';

export function Profile() {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userProfile = await api.getAthleteProfile('a1');
        setAthlete(userProfile);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Profile...</div>;
  if (!athlete) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <User className="h-16 w-16 text-slate-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{athlete.name}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" /> {athlete.gender}, {athlete.age} yrs
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {athlete.district}, {athlete.state}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {athlete.sportsInterest.map(sport => (
                <Badge key={sport} variant="neutral">{sport}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Overall Score</span>
              <span className="font-semibold text-slate-900">{athlete.overallScore}/100</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">National Percentile</span>
              <span className="font-semibold text-slate-900">{athlete.percentile}th</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Current Rank</span>
              <span className="font-semibold text-slate-900">#{athlete.rank}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {athlete.badges.map(badge => (
                <div key={badge} className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800 font-medium text-sm">
                  <Award className="h-4 w-4" />
                  {badge}
                </div>
              ))}
              {athlete.badges.length === 0 && (
                <p className="text-slate-500 text-sm">No badges earned yet. Complete assessments to earn badges!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
