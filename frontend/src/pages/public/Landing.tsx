import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Activity, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex flex-col pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-12 text-center flex flex-col items-center bg-white border-b border-slate-200 shadow-sm">
        <div className="animate-fade-in mb-8">
          <Badge variant="default" className="rounded-full px-4 py-1.5 text-sm font-semibold border border-primary-200">
            <ShieldCheck className="w-4 h-4 mr-2" /> SAI-Aligned Standardized Testing
          </Badge>
        </div>
        <h1 className="animate-slide-up text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 text-slate-900">
          AI-Powered <span className="text-primary-600">Sports Talent Assessment</span>
        </h1>
        <p className="animate-slide-up text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          An objective, computer-vision based measurement instrument for sports talent identification. 
          Conduct verifiable standardized fitness tests with demographic benchmarking and automated integrity checks.
        </p>
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 w-full sm:w-auto" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto shadow-sm">Start Assessment</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">View Measurement Protocol</Button>
          </Link>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-medium text-slate-500">
          <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-slate-400" /> End-to-end Data Privacy</div>
          <div className="flex items-center"><Activity className="w-4 h-4 mr-2 text-slate-400" /> SAI Benchmark Aligned</div>
          <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-slate-400" /> Age & Gender Normalized</div>
          <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-slate-400" /> Low-bandwidth Optimized</div>
        </div>
      </section>

      {/* Visual Flow / Product Screenshot Mock */}
      <section className="py-16 max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Verifiable Computer Vision Pipeline</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Our platform processes video capture directly on-device or via cloud, generating standardized pose-keypoint data to ensure fair and accurate scoring.</p>
        </div>
        
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative aspect-video flex items-center justify-center max-w-4xl mx-auto group">
          {/* Mock Video Frame */}
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            {/* Silhouette placeholder for athlete */}
            <div className="w-48 h-72 border-2 border-primary-500 border-dashed opacity-50 relative flex flex-col justify-between items-center py-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary-400 relative">
                 <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
              </div>
              <div className="w-24 h-32 border-2 border-primary-400 rounded-t-lg relative">
                 {/* Keypoints */}
                 <div className="absolute -left-2 top-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
                 <div className="absolute -right-2 top-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
                 <div className="absolute -left-4 bottom-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                 <div className="absolute -right-4 bottom-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="flex gap-4">
                 <div className="w-4 h-24 border-2 border-primary-400"></div>
                 <div className="w-4 h-24 border-2 border-primary-400"></div>
              </div>
            </div>
          </div>
          
          {/* Mock Overlay UI */}
          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur border border-white/10 px-3 py-1.5 rounded text-sm font-mono flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                TRACKING ACTIVE: KINEMATIC ANALYSIS
              </div>
              <div className="bg-black/50 backdrop-blur border border-white/10 px-3 py-1.5 rounded text-sm font-mono text-green-400">
                INTEGRITY: SINGLE CONTINUOUS TAKE
              </div>
            </div>
            <div className="self-end bg-black/60 backdrop-blur border border-white/20 p-4 rounded-lg min-w-[200px]">
              <div className="text-xs text-slate-400 font-mono mb-1">METRIC: VERTICAL JUMP</div>
              <div className="text-3xl font-bold font-mono">54.2 <span className="text-sm text-slate-400">cm</span></div>
              <div className="mt-2 text-xs bg-primary-600/30 text-primary-200 px-2 py-1 rounded inline-block">78th Percentile (U-16 Male)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
