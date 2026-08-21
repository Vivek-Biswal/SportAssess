import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Activity, Calendar, ChevronRight, Filter, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AssessmentResult } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';

export function MyAssessments() {
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();
  const [pastAssessments, setPastAssessments] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchResults() {
      if (user?.id) {
        try {
          const results = await api.getAthleteResults(user.id);
          setPastAssessments(results);
        } catch (error) {
          console.error("Failed to fetch assessments", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [user]);

  const filteredAssessments = pastAssessments.filter(a => {
    const testName = (a as any).test?.name || 'Assessment';
    const status = a.verificationStatus || '';
    return testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Assessments</h1>
          <p className="text-slate-500">View and manage your performance history.</p>
        </div>
        <Link to="/assessments">
          <Button>Take New Assessment</Button>
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
          <CardTitle className="text-lg">Assessment History</CardTitle>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tests..."
                className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 whitespace-nowrap bg-white">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment) => (
                <div key={assessment.id} className="p-4 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${assessment.verificationStatus === 'Verified' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{(assessment as any).test?.name || 'Assessment'}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(assessment.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">Score: {assessment.score} {assessment.unit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-6 ml-14 sm:ml-0">
                    <div className="flex items-center gap-3">
                      {assessment.verificationStatus === 'Verified' ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Pending Review</Badge>
                      )}
                      {assessment.percentile > 0 && (
                        <Badge variant="default">{assessment.percentile}th %ile</Badge>
                      )}
                    </div>
                    
                    <Link to={`/result/${assessment.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary-600">
                        Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500">
                No assessments found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
