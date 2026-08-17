import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Activity, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex flex-col gap-16 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-16 pb-8 text-center flex flex-col items-center">
        <div className="animate-fade-in inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-primary-700 bg-primary-100/80 mb-8 border border-primary-200">
          <Activity className="w-4 h-4 mr-2" /> AI-Powered Sports Talent Assessment
        </div>
        <h1 className="animate-slide-up text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          <span className="text-slate-900">Discover India's Next </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Generation of Athletes</span>
        </h1>
        <p className="animate-slide-up text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          AI-assisted sports talent assessment that helps athletes measure performance, 
          verify results, and showcase their potential — wherever they live.
        </p>
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 w-full sm:w-auto" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-500/30">Start Assessment</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">Explore How It Works</Button>
          </Link>
        </div>
      </section>

      {/* Visual Flow / Trust Indicators */}
      <section className="animate-slide-up glass-card rounded-3xl p-8 md:p-12 max-w-5xl mx-auto w-full relative overflow-hidden" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-primary-400/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="flex flex-col items-center group cursor-default">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Remote Accessibility</h3>
            <p className="text-sm text-slate-500 mt-2">Assessments from anywhere</p>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">AI Analysis</h3>
            <p className="text-sm text-slate-500 mt-2">Computer vision metrics</p>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Verified Records</h3>
            <p className="text-sm text-slate-500 mt-2">Secure & anti-cheat</p>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">National Benchmarks</h3>
            <p className="text-sm text-slate-500 mt-2">Compare by age & gender</p>
          </div>
        </div>
      </section>
    </div>
  );
}
