import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { api } from '../../services/api';
import { Athlete } from '../../types';
import { User, MapPin, Activity, Award, AlertCircle, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Profile() {
  const { user } = useAuth();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const userProfile = await api.getAthleteProfile(user.id);
        setAthlete(userProfile);
        setError(null);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load profile data");
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Profile Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="h-32 w-32 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border-4 border-white/20 backdrop-blur-sm">
            <User className="h-16 w-16 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white">{athlete.name}</h1>
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-300 font-medium">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5 opacity-70" /> {athlete.gender}, {athlete.age} yrs
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 opacity-70" /> {athlete.district}, {athlete.state}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
              {athlete.sportsInterest.map(sport => (
                <span key={sport} className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm text-white">
                  {sport}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      <Card>
        <CardHeader className="border-b border-border-subtle bg-bg-base/50 pb-4 pt-6 px-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-orange-500" />
            Badges & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            {athlete.badges.map(badge => (
              <div key={badge} className="px-5 py-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center gap-3 text-orange-800 dark:text-orange-300 font-semibold shadow-sm">
                <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                {badge}
              </div>
            ))}
            {athlete.badges.length === 0 && (
              <div className="w-full text-center py-8">
                <div className="mx-auto w-16 h-16 bg-bg-base rounded-full flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-text-secondary opacity-50" />
                </div>
                <p className="text-text-secondary font-medium">No badges earned yet.</p>
                <p className="text-sm text-text-secondary opacity-80 mt-1">Complete assessments to unlock achievements!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
