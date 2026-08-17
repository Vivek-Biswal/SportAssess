import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Star, Trash2, Download, MapPin, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShortlistedAthlete {
  id: string;
  name: string;
  age: number;
  gender: string;
  state: string;
  district: string;
  sport: string;
  percentile: number;
  score: string;
  dateShortlisted: string;
}

export function Shortlist() {
  const [shortlisted, setShortlisted] = useState<ShortlistedAthlete[]>([
    { id: 'sa_01', name: 'Arjun Mehta', age: 17, gender: 'Male', state: 'Maharashtra', district: 'Pune', sport: 'Athletics', percentile: 96, score: '68 cm', dateShortlisted: 'Nov 12, 2023' },
    { id: 'sa_02', name: 'Priya Sharma', age: 16, gender: 'Female', state: 'Delhi', district: 'South Delhi', sport: 'Athletics', percentile: 93, score: '4.6 s', dateShortlisted: 'Nov 10, 2023' },
    { id: 'sa_03', name: 'Ravi Kumar', age: 19, gender: 'Male', state: 'Gujarat', district: 'Ahmedabad', sport: 'Athletics', percentile: 91, score: '9.0 s', dateShortlisted: 'Nov 08, 2023' },
  ]);

  const { showToast } = useToast();

  const handleRemove = (id: string) => {
    setShortlisted(prev => prev.filter(a => a.id !== id));
    showToast('Athlete removed from shortlist', 'success');
  };

  const handleExport = () => {
    showToast('Exporting shortlist as CSV...', 'info');
    // Simulated export delay
    setTimeout(() => {
      showToast('Export complete', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shortlisted Athletes</h1>
          <p className="text-slate-500">Athletes flagged for further evaluation and selection camps.</p>
        </div>
        <Button variant="outline" className="bg-white" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export List
        </Button>
      </div>

      {shortlisted.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-16 text-center">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Athletes Shortlisted</h3>
            <p className="text-slate-500">Use the Official Dashboard to review and shortlist high-potential athletes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortlisted.map(athlete => (
            <Card key={athlete.id} className="glass-card group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{athlete.name}</h3>
                    <p className="text-sm text-slate-500">{athlete.age}y, {athlete.gender} · {athlete.sport}</p>
                  </div>
                  <Badge variant={athlete.percentile >= 95 ? 'success' : 'default'} className="text-sm font-bold shadow-sm">
                    {athlete.percentile}th %ile
                  </Badge>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                    {athlete.district}, {athlete.state}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                    Shortlisted: {athlete.dateShortlisted}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Star className="w-3.5 h-3.5 mr-2 text-yellow-500 shrink-0" />
                    Best Score: <span className="font-semibold text-slate-900 ml-1">{athlete.score}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button size="sm" className="flex-1">View Profile</Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleRemove(athlete.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
