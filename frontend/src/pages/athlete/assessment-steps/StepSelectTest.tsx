import React from 'react';
import { AssessmentTest } from '../../../types';
import { Badge } from '../../../components/common/Badge';

interface Props {
  tests: AssessmentTest[];
  onSelect: (test: AssessmentTest) => void;
}

export function StepSelectTest({ tests, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {tests.map(test => (
        <div 
          key={test.id} 
          className="border border-slate-200 rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors bg-white hover:shadow-md"
          onClick={() => onSelect(test)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-900">{test.name}</h3>
            {test.aiVerificationAvailable && <Badge variant="success">AI Ready</Badge>}
          </div>
          <p className="text-sm text-slate-500 mb-4">{test.description}</p>
          <div className="text-xs text-slate-400 flex gap-4">
            <span>Difficulty: {test.difficulty}</span>
            <span>~{test.estimatedDurationMin} min</span>
          </div>
        </div>
      ))}
    </div>
  );
}
