import React from 'react';
import { AssessmentTest } from '../../../types';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Activity, Target, Shield, Clock, BarChart, ArrowRight } from 'lucide-react';

interface Props {
  tests: AssessmentTest[];
  onSelect: (test: AssessmentTest) => void;
}

export function StepSelectTest({ tests, onSelect }: Props) {
  
  const getIconForTest = (name: string) => {
    switch (name) {
      case 'Vertical Jump': return <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />;
      case 'Football Juggling': return <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />;
      case 'Push-ups': return <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />;
      case 'Sit-ups': return <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />;
      default: return <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
      {tests.map(test => (
        <div 
          key={test.id} 
          className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl dark:hover:shadow-primary-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          onClick={() => onSelect(test)}
        >
          {/* Card Header */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 group-hover:border-primary-100 dark:group-hover:border-primary-800 transition-colors">
                {getIconForTest(test.name)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {test.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{test.category}</p>
              </div>
            </div>
            {test.aiVerificationAvailable && (
              <Badge variant="success" className="shadow-sm">AI Ready</Badge>
            )}
          </div>

          {/* Card Body */}
          <div className="p-6 flex-grow flex flex-col justify-between bg-white dark:bg-slate-900">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 min-h-[40px]">
                {test.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <BarChart className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Difficulty</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{test.difficulty}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Duration</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">~{test.estimatedDurationMin} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white shadow-md group-hover:shadow-lg transition-all flex items-center justify-center gap-2 py-5"
            >
              Start Assessment <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
