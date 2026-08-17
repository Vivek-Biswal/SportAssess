import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { AssessmentResult } from '../../types';
import { CheckCircle2, AlertTriangle, ChevronLeft, BarChart2, Video } from 'lucide-react';

export function Result() {
  const { id } = useParams();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      if (id) {
        try {
          const data = await api.getAssessmentResult(id);
          setResult(data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadResult();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Result...</div>;
  if (!result) return <div className="p-8 text-center text-red-500">Result not found.</div>;

  const isVerified = result.verificationStatus === 'Verified';

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{result.testId === 't1' ? 'Vertical Jump' : 'Assessment'}</CardTitle>
                <p className="text-slate-500 text-sm mt-1">{new Date(result.date).toLocaleDateString()}</p>
              </div>
              <Badge variant={isVerified ? 'success' : 'warning'} className="text-sm px-3 py-1">
                {result.verificationStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-7xl font-black text-slate-900 mb-2">
                {result.score} <span className="text-3xl text-slate-500 font-medium">{result.unit}</span>
              </div>
              <div className="mt-4 flex gap-4">
                <Badge variant="neutral" className="text-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-500 inline" /> AI Confidence: {result.aiConfidence}%
                </Badge>
                {result.cheatDetected ? (
                   <Badge variant="danger" className="text-sm">
                     <AlertTriangle className="w-3 h-3 mr-1 inline" /> Anomaly Detected
                   </Badge>
                ) : (
                   <Badge variant="neutral" className="text-sm">
                     <CheckCircle2 className="w-3 h-3 mr-1 text-green-500 inline" /> No anomaly detected
                   </Badge>
                )}
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h4 className="font-semibold text-slate-900 mb-4">AI Performance Analysis</h4>
              <p className="text-sm text-slate-600 mb-4">
                Based on computer vision analysis of your movement, your takeoff phase was explosive, but arm swing coordination could be improved for an extra 2-3cm gain.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Video className="w-4 h-4 mr-2"/> View Evidence</Button>
                <Button variant="outline" size="sm"><BarChart2 className="w-4 h-4 mr-2"/> Download Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benchmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Compared to Male, 18 yrs</p>
              <p className="text-lg font-bold text-slate-900">{result.benchmarkStatus}</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Percentile</span>
                <span className="font-bold text-primary-600">{result.percentile}th</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${result.percentile}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">You outperformed {result.percentile}% of athletes in your demographic.</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link to="/benchmarks">
                <Button variant="secondary" className="w-full">Compare Benchmarks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
