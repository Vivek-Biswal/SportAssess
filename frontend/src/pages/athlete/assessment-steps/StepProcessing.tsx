import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface Props {
  status: string;
}

export function StepProcessing({ status }: Props) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="h-24 w-24 rounded-full flex items-center justify-center bg-white z-10 relative shadow-sm">
          <BrainCircuit className="h-10 w-10 text-primary-600" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Video</h3>
        <p className="text-slate-500 animate-pulse font-medium">{status}</p>
      </div>
    </div>
  );
}
