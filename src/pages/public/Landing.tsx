import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Activity, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="pt-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 mb-6">
          <Activity className="w-4 h-4 mr-2" /> AI-Powered Sports Talent Assessment
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6">
          Discover India's Next Generation of Athletes
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
          AI-assisted sports talent assessment that helps athletes measure performance, 
          verify results, and showcase their potential — wherever they live.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">Start Assessment</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">Explore How It Works</Button>
          </Link>
        </div>
      </section>

      {/* Visual Flow / Trust Indicators */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Remote Accessibility</h3>
            <p className="text-sm text-slate-500 mt-2">Assessments from anywhere</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <Activity className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">AI Analysis</h3>
            <p className="text-sm text-slate-500 mt-2">Computer vision metrics</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Verified Records</h3>
            <p className="text-sm text-slate-500 mt-2">Secure & anti-cheat</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <TrendingUp className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">National Benchmarks</h3>
            <p className="text-sm text-slate-500 mt-2">Compare by age & gender</p>
          </div>
        </div>
      </section>
    </div>
  );
}
