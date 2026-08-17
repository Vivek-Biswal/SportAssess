import React from 'react';
import { Button } from '../../../components/common/Button';
import { Video } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function StepPrepare({ onNext, onBack }: Props) {
  return (
    <div className="text-center space-y-6 py-8 animate-fade-in">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Video className="h-10 w-10 text-slate-600" />
      </div>
      <h3 className="text-xl font-medium text-slate-900">Ready your camera</h3>
      <p className="text-slate-500 max-w-md mx-auto">
        Prop your phone against a stable surface. You will have a 10-second countdown before recording begins.
      </p>
      <div className="pt-4 flex justify-center gap-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Ready</Button>
      </div>
    </div>
  );
}
