import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Search, Filter, BarChart3 } from 'lucide-react';

export function Benchmarks() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock benchmark data
  const benchmarks = [
    { id: 1, test: 'Vertical Jump', ageGroup: '14-16', gender: 'Male', p50: '45 cm', p75: '55 cm', p90: '65+ cm' },
    { id: 2, test: 'Vertical Jump', ageGroup: '14-16', gender: 'Female', p50: '35 cm', p75: '45 cm', p90: '55+ cm' },
    { id: 3, test: '40m Sprint', ageGroup: '17-19', gender: 'Male', p50: '5.2 s', p75: '4.8 s', p90: '4.5- s' },
    { id: 4, test: '40m Sprint', ageGroup: '17-19', gender: 'Female', p50: '6.0 s', p75: '5.5 s', p90: '5.0- s' },
    { id: 5, test: 'Agility T-Test', ageGroup: 'All', gender: 'Male', p50: '10.5 s', p75: '9.8 s', p90: '9.0- s' },
    { id: 6, test: 'Agility T-Test', ageGroup: 'All', gender: 'Female', p50: '11.5 s', p75: '10.8 s', p90: '10.0- s' },
  ];

  const filteredBenchmarks = benchmarks.filter(b => 
    b.test.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.ageGroup.includes(searchQuery) ||
    b.gender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 mb-4">
          <BarChart3 className="w-4 h-4 mr-2" /> Performance Standards
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          National Benchmarks
        </h1>
        <p className="text-lg text-slate-600">
          Explore the performance standards used by the Sports Authority of India to identify high-potential talent across different age groups and disciplines.
        </p>
      </section>

      {/* Explorer Section */}
      <section className="max-w-5xl mx-auto w-full">
        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-5">
            <div>
              <CardTitle>Benchmark Explorer</CardTitle>
              <CardDescription>Search by test name, age, or gender</CardDescription>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Vertical Jump, Male"
                  className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 whitespace-nowrap bg-white">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Assessment Test</th>
                    <th className="py-4 px-6">Age Group</th>
                    <th className="py-4 px-6">Gender</th>
                    <th className="py-4 px-6">50th Percentile (Avg)</th>
                    <th className="py-4 px-6 text-primary-700">75th Percentile (Good)</th>
                    <th className="py-4 px-6 text-green-700">90th Percentile (Elite)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBenchmarks.length > 0 ? (
                    filteredBenchmarks.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-900">{b.test}</td>
                        <td className="py-4 px-6 text-slate-600">
                          <Badge variant="neutral">{b.ageGroup}</Badge>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{b.gender}</td>
                        <td className="py-4 px-6 font-medium text-slate-600">{b.p50}</td>
                        <td className="py-4 px-6 font-semibold text-primary-600">{b.p75}</td>
                        <td className="py-4 px-6 font-bold text-green-600">{b.p90}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No benchmarks found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
