import React from 'react';
import { AssessmentTest } from '../../../types';
import { Button } from '../../../components/common/Button';
import { AlertCircle } from 'lucide-react';

interface Props {
  selectedTest: AssessmentTest;
  onNext: () => void;
  onBack: () => void;
}

export function StepInstructions({ selectedTest, onNext, onBack }: Props) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800 border border-blue-100">
        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
        <p className="text-sm">
          For the AI to accurately assess your performance in <strong>{selectedTest.name}</strong>, you must follow these instructions exactly. Failure to do so may result in an invalid assessment.
        </p>
      </div>
      <ul className="list-disc pl-5 space-y-2 text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-100">
        <li>Ensure full body is visible in the frame at all times.</li>
        <li>Place camera at waist height, roughly 3 meters away.</li>
        <li>Ensure good lighting; avoid recording against bright windows.</li>
        <li>Wear contrasting clothes to the background.</li>
      </ul>
      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>I Understand, Next</Button>
      </div>
    </div>
  );
}
