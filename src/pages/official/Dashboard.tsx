import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { api } from '../../services/api';
import { Athlete, OfficialStats } from '../../types';
import { Users, CheckCircle, Clock, Star, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [stats, setStats] = useState<OfficialStats | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, athletesData] = await Promise.all([
          api.getOfficialStats(),
          api.searchAthletes('', {})
        ]);
        setStats(statsData);
        setAthletes(athletesData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = [
    { name: 'Maharashtra', athletes: 4000 },
    { name: 'Delhi', athletes: 3000 },
    { name: 'Gujarat', athletes: 2000 },
    { name: 'Karnataka', athletes: 2780 },
    { name: 'Kerala', athletes: 1890 },
  ];

  if (isLoading || !stats) return <div className="p-8 text-center text-slate-500">Loading Official Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Official Dashboard</h1>
          <p className="text-slate-500">National talent pool overview</p>
        </div>
        <Button variant="outline">Download Reports</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg"><Users className="text-blue-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Athletes</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalAthletes.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="text-green-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Verified Tests</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.verifiedAssessments.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg"><Clock className="text-yellow-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.pendingReviews}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg"><Star className="text-purple-600 h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">High Potential</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.highPotentialAthletes.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Participating States</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="athletes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Athlete Search & Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Athlete Search</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search athletes..."
                  className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                    <th className="pb-3 px-4">Athlete</th>
                    <th className="pb-3 px-4">Location</th>
                    <th className="pb-3 px-4">Score</th>
                    <th className="pb-3 px-4">Percentile</th>
                    <th className="pb-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((athlete) => (
                    <tr key={athlete.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{athlete.name}</div>
                        <div className="text-xs text-slate-500">{athlete.age}y, {athlete.gender}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm">
                        {athlete.district}, {athlete.state}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {athlete.overallScore}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={athlete.percentile > 90 ? 'success' : 'neutral'}>
                          {athlete.percentile}th
                        </Badge>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                         <Button variant="ghost" size="sm">Review</Button>
                         <Button variant="outline" size="sm">Shortlist</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
