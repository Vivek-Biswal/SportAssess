import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  ClipboardCheck,
  Eye,
  Cpu,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  ListChecks,
  LineChart,
  Search,
  Star,
  Wifi,
  Lock,
} from 'lucide-react';

export function Landing() {
  return (
<<<<<<< HEAD
    <div className="flex flex-col pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-12 text-center flex flex-col items-center bg-bg-surface border-b border-border-subtle shadow-sm transition-colors duration-300">
        <div className="animate-fade-in mb-8">
          <Badge variant="default" className="rounded-full px-4 py-1.5 text-sm font-semibold border border-primary-200 dark:border-primary-800">
            <ShieldCheck className="w-4 h-4 mr-2" /> SAI-Aligned Standardized Testing
          </Badge>
        </div>
        <h1 className="animate-slide-up text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 text-text-primary">
          AI-Powered <span className="text-primary-600 dark:text-primary-400">Sports Talent Assessment</span>
        </h1>
        <p className="animate-slide-up text-lg text-text-secondary max-w-2xl mb-10 leading-relaxed" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          An objective, computer-vision based measurement instrument for sports talent identification. 
          Conduct verifiable standardized fitness tests with demographic benchmarking and automated integrity checks.
        </p>
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 w-full sm:w-auto" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto shadow-sm">Start Assessment</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-bg-surface">View Measurement Protocol</Button>
          </Link>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-bg-base border-b border-border-subtle py-6 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-medium text-text-secondary">
          <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 opacity-70" /> End-to-end Data Privacy</div>
          <div className="flex items-center"><Activity className="w-4 h-4 mr-2 opacity-70" /> SAI Benchmark Aligned</div>
          <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 opacity-70" /> Age & Gender Normalized</div>
          <div className="flex items-center"><Users className="w-4 h-4 mr-2 opacity-70" /> Low-bandwidth Optimized</div>
        </div>
      </section>

      {/* Visual Flow / Product Screenshot Mock */}
      <section className="py-16 max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Verifiable Computer Vision Pipeline</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Our platform processes video capture directly on-device or via cloud, generating standardized pose-keypoint data to ensure fair and accurate scoring.</p>
        </div>
=======
    <div className="flex flex-col overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-24 text-center flex flex-col items-center bg-white border-b border-slate-200/80">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(100,116,139,0.06)_1px,_transparent_0)] bg-[length:32px_32px]" />
>>>>>>> 0df999fa31251bd208894aa352bf36d9d15aed9a
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="animate-fade-in mb-6">
            <Badge variant="default" className="rounded-full px-4 py-1.5 text-sm font-semibold border border-primary-200">
              <Activity className="w-4 h-4 mr-2" /> AI-Assisted Sports Assessment Platform
            </Badge>
          </div>

          <h1 className="animate-slide-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Measure Athletic Potential.{' '}
            <span className="text-primary-600">Discover Talent.</span>
          </h1>

          <p
            className="animate-slide-up text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            SportAssess helps standardize athletic assessment across India through
            structured testing protocols, benchmark-based evaluation, and
            AI-assisted performance analysis — making talent identification
            accessible, objective, and fair.
          </p>

          <div
            className="animate-slide-up flex flex-col sm:flex-row gap-3 justify-center"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─── */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 text-center">
          {[
            { icon: ClipboardCheck, label: 'Standardized\nAssessment' },
            { icon: BarChart3, label: 'Benchmark\nEvaluation' },
            { icon: Lock, label: 'Data\nPrivacy' },
            { icon: Wifi, label: 'Low-Bandwidth\nAccessible' },
            { icon: LineChart, label: 'Performance\nAnalytics' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 py-2">
              <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center">
                <Icon className="h-4.5 w-4.5 text-primary-600" />
              </div>
              <span className="text-xs font-medium text-slate-500 whitespace-pre-line leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Assessment Process ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A straightforward process designed for athletes at every level —
              from grassroots to state and national selection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Register & Build Profile',
                desc: 'Create your athlete profile with your sport, age group, and region.',
                icon: UserCheck,
              },
              {
                step: '02',
                title: 'Select Assessment',
                desc: 'Choose from standardized fitness and sport-specific tests aligned with established protocols.',
                icon: ListChecks,
              },
              {
                step: '03',
                title: 'Perform & Record',
                desc: 'Complete the test under standardized conditions. Record your performance for submission.',
                icon: Activity,
              },
              {
                step: '04',
                title: 'Analysis & Scoring',
                desc: 'Your performance is processed and scored against demographic-appropriate benchmarks.',
                icon: Cpu,
              },
              {
                step: '05',
                title: 'Review Results',
                desc: 'Receive detailed results with percentile ranking, strengths, and areas for improvement.',
                icon: BarChart3,
              },
              {
                step: '06',
                title: 'Track Progress',
                desc: 'Build a longitudinal assessment history to demonstrate improvement over time.',
                icon: TrendingUp,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="group relative bg-slate-50 rounded-xl p-6 border border-slate-200/60 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200"
              >
                <span className="text-xs font-bold text-primary-500 tracking-widest uppercase mb-3 block">
                  Step {step}
                </span>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-primary-200 transition-colors">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Technology Section ─── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Built for Scientific Measurement
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              SportAssess combines standardized testing protocols with modern
              technology to deliver objective, reproducible, and verifiable
              athletic assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: ClipboardCheck,
                title: 'Standardized Test Protocols',
                desc: 'Every assessment follows established sport-science protocols — ensuring consistency whether an athlete is tested in Delhi or a rural district.',
              },
              {
                icon: Target,
                title: 'Benchmark-Based Scoring',
                desc: 'Performance is evaluated against age-appropriate and gender-appropriate benchmarks, enabling fair comparison across demographics.',
              },
              {
                icon: ShieldCheck,
                title: 'Integrity Verification',
                desc: 'Built-in checks help verify that tests are conducted under proper conditions, supporting the credibility of every result.',
              },
              {
                icon: Cpu,
                title: 'AI-Assisted Analysis Pipeline',
                desc: 'The platform is designed to integrate computer-vision based performance analysis, enabling automated measurement from video submissions in future updates.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-0 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="h-11 w-11 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benchmarking Section ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Benchmarks Matter
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Raw performance numbers mean little without context. A 12-second
                100m sprint is elite for a 14-year-old but average for a
                senior athlete. SportAssess contextualizes every result against
                demographic-appropriate benchmarks so that talent is identified
                fairly — regardless of age, gender, or region.
              </p>
              <ul className="space-y-3">
                {[
                  'Age and gender normalized scoring',
                  'Percentile-based ranking across demographics',
                  'Regional and national comparison support',
                  'Longitudinal tracking across assessment periods',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/benchmarks" className="inline-block mt-6">
                <Button variant="outline" size="sm">
                  View Benchmarks <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Visual: Abstract benchmark chart */}
            <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-6 lg:p-8">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Sample Benchmark Visualization
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Speed (100m)', pct: 78, color: 'bg-primary-500' },
                  { label: 'Endurance', pct: 65, color: 'bg-primary-400' },
                  { label: 'Vertical Jump', pct: 85, color: 'bg-primary-600' },
                  { label: 'Agility', pct: 72, color: 'bg-primary-500' },
                  { label: 'Flexibility', pct: 58, color: 'bg-primary-300' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700">{label}</span>
                      <span className="text-slate-400 text-xs">{pct}th percentile</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-4 italic">
                Illustrative example only. Actual results are generated from real assessment data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Value Props: Athletes & Officials ─── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Built for Everyone in Sports
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Whether you are an aspiring athlete or a sports official,
              SportAssess provides the tools to measure, track, and discover
              talent objectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Athlete Card */}
            <Card className="p-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-11 w-11 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">For Athletes</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Understand your current performance level with standardized assessments',
                    'Track improvement across multiple assessment periods',
                    'Identify your strengths and focus areas for training',
                    'Build a verified assessment history for selection events',
                    'Compare your performance against demographic-appropriate benchmarks',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Official Card */}
            <Card className="p-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-11 w-11 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">For Officials & Coaches</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Access structured, standardized athlete assessment data',
                    'Compare athletes fairly using consistent testing protocols',
                    'Discover talent across regions with objective performance metrics',
                    'Build shortlists based on verified assessment results',
                    'Reduce subjectivity in talent identification decisions',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Begin Your Assessment Journey
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Join athletes and officials across India using SportAssess for
            standardized, objective, and accessible talent assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/benchmarks">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Benchmarks
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
