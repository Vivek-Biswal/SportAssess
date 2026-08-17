import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Globe, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-lg tracking-tight text-slate-900">
                SportTalent <span className="text-primary-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-6">
              Democratizing sports talent assessment across India through AI-powered mobile computer vision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <span className="sr-only">Website</span>
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Section 1 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/how-it-works" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">How It Works</Link></li>
              <li><Link to="/assessments" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Take Assessment</Link></li>
              <li><Link to="/benchmarks" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Benchmarks</Link></li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">AI Guidelines</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Links Section 3 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Data Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SportTalent AI. All rights reserved.
          </p>
          <div className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
            Prototype developed for Smart India Hackathon
          </div>
        </div>
      </div>
    </footer>
  );
}
