import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { AssessmentResult } from '../../types';
import { CheckCircle2, AlertTriangle, ChevronLeft, BarChart2, Video } from 'lucide-react';
import { Skeleton } from '../../components/common/Skeleton';

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

  if (isLoading) return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-fade-in">
      <Skeleton className="h-4 w-36" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-bg-surface rounded-xl border border-border-subtle p-8 space-y-6">
          <div className="flex justify-between"><Skeleton className="h-7 w-40" /><Skeleton className="h-6 w-20 rounded-full" /></div>
          <div className="flex flex-col items-center py-8 space-y-4">
            <Skeleton className="h-20 w-48" />
            <div className="flex gap-4"><Skeleton className="h-6 w-32 rounded-full" /><Skeleton className="h-6 w-36 rounded-full" /></div>
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
        <div className="bg-bg-surface rounded-xl border border-border-subtle p-6 space-y-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
  if (!result) return <div className="p-8 text-center text-red-500">Result not found.</div>;

  const isVerified = result.verificationStatus === 'Verified';

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-4 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4 border-b border-border-subtle">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-extrabold text-text-primary">{result.testId === 't1' ? 'Vertical Jump' : 'Assessment'}</CardTitle>
                <p className="text-text-secondary text-sm mt-1">{new Date(result.date).toLocaleDateString()}</p>
              </div>
              <Badge variant={isVerified ? 'success' : 'warning'} className="text-sm px-3 py-1 shadow-sm">
                {result.verificationStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Visual Evidence Area */}
            <div className="relative w-full aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
              <div className="text-slate-500 flex flex-col items-center px-4 text-center">
                <Video className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm font-medium">Visual evidence generation is not currently supported by the CV pipeline.</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-6 relative">
                {/* Flex container for score and unit to prevent tall selection boxes */}
                <div className="flex items-baseline justify-center gap-2 mb-2 relative z-10">
                  <span className="text-7xl font-black text-text-primary tracking-tighter">{result.score}</span>
                  <span className="text-3xl text-text-secondary font-bold">{result.unit}</span>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4 relative z-10">
                  <Badge variant="neutral" className="text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400 inline" /> AI Confidence: {result.aiConfidence}%
                  </Badge>
                  {result.cheatDetected ? (
                     <Badge variant="danger" className="text-sm">
                       <AlertTriangle className="w-4 h-4 mr-1.5 inline" /> Integrity: Anomaly Detected
                     </Badge>
                  ) : (
                     <Badge variant="neutral" className="text-sm">
                       <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400 inline" /> Integrity: {result.verificationStatus}
                     </Badge>
                  )}
                </div>
              </div>
              
              <div className="border-t border-border-subtle pt-6 mt-2">
                <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" /> Assessment Notes
                </h4>
                <p className="text-text-secondary mb-6 leading-relaxed bg-bg-base p-4 rounded-lg border border-border-subtle text-sm">
                  {result.cheatDetected 
                    ? "Our AI detected an anomaly during your assessment. Please review the footage and ensure you follow all protocol guidelines."
                    : result.verificationStatus === 'Verified'
                    ? "Your assessment has been successfully verified by our computer vision model. Good work!"
                    : "Your assessment is currently pending manual review or further verification."}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline"><BarChart2 className="w-4 h-4 mr-2"/> Download Report</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="border-b border-border-subtle">
            <CardTitle>Benchmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6 flex-1 flex flex-col">
            {result.percentile !== null && result.percentile !== undefined ? (
              <>
                <div>
                  <p className="text-sm text-text-secondary mb-1 font-medium">Demographic data unavailable</p>
                  <p className="text-xl font-bold text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-300">{result.benchmarkStatus || 'Calculated'}</p>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-6">
                    <span className="font-medium text-text-primary">Percentile Rank</span>
                    <span className="font-extrabold text-primary-600 dark:text-primary-400 text-lg">{result.percentile}th</span>
                  </div>
                  
                  {/* Visual Performance Gauge */}
                  <div className="relative pt-4 pb-2 mb-2 group">
                    <div className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full shadow-inner"></div>
                    <div 
                      className="absolute top-2 -translate-x-1/2 w-4 h-7 bg-text-primary rounded-[2px] border-2 border-bg-surface shadow-md transition-all duration-1000 ease-out"
                      style={{ left: `${result.percentile}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-text-primary text-bg-surface text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {result.percentile}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-text-secondary font-bold uppercase tracking-wider mt-2">
                    <span>Poor</span>
                    <span>Avg</span>
                    <span>Good</span>
                    <span>Elite</span>
                  </div>
                  
                  <p className="text-sm text-text-secondary mt-6 leading-relaxed bg-primary-50/50 dark:bg-primary-900/20 p-3 rounded-lg border border-primary-100/50 dark:border-primary-800/50">
                    You outperformed <strong className="text-text-primary">{result.percentile}%</strong> of athletes in your demographic.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-10">
                <BarChart2 className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium mb-1">Benchmark Unavailable</p>
                <p className="text-sm">Demographic benchmarks are not currently configured for this assessment.</p>
              </div>
            )}

            <div className="pt-4 border-t border-border-subtle mt-auto">
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
