import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton, SkeletonStatCard, SkeletonTableRow } from '../../components/common/Skeleton';
import { api } from '../../services/api';
import { Athlete, OfficialStats } from '../../types';
import { Users, CheckCircle, Clock, Star, Search, Filter, X, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [stats, setStats] = useState<OfficialStats | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterGender, setFilterGender] = useState('');
  const [filterAgeGroup, setFilterAgeGroup] = useState('');
  const [filterState, setFilterState] = useState('');

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

  if (isLoading || !stats) return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 lg:col-span-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 lg:col-span-2">
          <div className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <table className="w-full"><tbody>
              {[1, 2, 3, 4].map(i => <SkeletonTableRow key={i} />)}
            </tbody></table>
          </div>
        </div>
      </div>
    </div>
  );

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
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Athlete Search</CardTitle>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search athletes..."
                  className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-9 whitespace-nowrap transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" /> Filter
                {(filterGender || filterAgeGroup || filterState) && (
                  <span className="ml-1.5 bg-primary-600 text-white text-xs rounded-full h-4 w-4 inline-flex items-center justify-center">
                    {[filterGender, filterAgeGroup, filterState].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>
            
            {/* Filter Panel */}
            {showFilters && (
              <div className="w-full animate-fade-in bg-slate-50 rounded-xl p-4 border border-slate-200 mt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Gender</label>
                    <select
                      className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                    >
                      <option value="">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Age Group</label>
                    <select
                      className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={filterAgeGroup}
                      onChange={(e) => setFilterAgeGroup(e.target.value)}
                    >
                      <option value="">All Ages</option>
                      <option value="14-16">14–16</option>
                      <option value="17-19">17–19</option>
                      <option value="20-23">20–23</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">State</label>
                    <select
                      className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value={filterState}
                      onChange={(e) => setFilterState(e.target.value)}
                    >
                      <option value="">All States</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 text-slate-500 hover:text-red-600"
                      onClick={() => { setFilterGender(''); setFilterAgeGroup(''); setFilterState(''); }}
                    >
                      <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full text-left border-collapse min-w-[700px] whitespace-nowrap">
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
                  {athletes
                    .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .filter(a => !filterGender || a.gender === filterGender)
                    .filter(a => {
                      if (!filterAgeGroup) return true;
                      const [min, max] = filterAgeGroup.split('-').map(Number);
                      return a.age >= min && a.age <= max;
                    })
                    .filter(a => !filterState || a.state === filterState)
                    .map((athlete) => (
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
