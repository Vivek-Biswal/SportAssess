import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { AssessmentTest } from '../../types';

import { StepSelectTest } from './assessment-steps/StepSelectTest';
import { StepInstructions } from './assessment-steps/StepInstructions';
import { StepPrepare } from './assessment-steps/StepPrepare';
import { StepUpload } from './assessment-steps/StepUpload';
import { StepProcessing } from './assessment-steps/StepProcessing';

export function AssessmentFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tests, setTests] = useState<AssessmentTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<AssessmentTest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchTests() {
      const data = await api.getAssessments();
      setTests(data);
    }
    fetchTests();
  }, []);

  const handleTestSelect = (test: AssessmentTest) => {
    setSelectedTest(test);
    setStep(2);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('video/') || file.type === 'video/mp4' || file.type === 'video/quicktime')) {
      if (file.size > 50 * 1024 * 1024) {
        showToast('File size exceeds 50MB limit.', 'error');
        return;
      }
      
      showToast('Video selected successfully!', 'success');
      setStep(5);
      setIsProcessing(true);
      setProcessStatus('Uploading video...');
      
      try {
        const { processId } = await api.uploadVideo(file, selectedTest!.id);
        
        const phases = ['Preparing frames', 'Detecting athlete', 'Analyzing movement', 'Checking test conditions', 'Calculating performance'];
        for (let i = 0; i < phases.length; i++) {
          await new Promise(r => setTimeout(r, 800));
          setProcessStatus(phases[i] + '...');
        }
        
        setProcessStatus('Running verification...');
        const { resultId } = await api.checkAiProcessStatus(processId);
        
        if (resultId) {
          navigate(`/result/${resultId}`);
        }
      } catch (err) {
        console.error(err);
        showToast('Analysis failed. Please try again.', 'error');
        setProcessStatus('Analysis failed. Please try again.');
        setStep(4);
      } finally {
        setIsProcessing(false);
      }
    } else {
      showToast('Please upload a valid video file (MP4, MOV).', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {[1, 2, 3, 4, 5].map(num => (
          <div key={num} className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
            step >= num ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-slate-200 text-slate-500'
          }`}>
            {num}
          </div>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle>
            {step === 1 && 'Select Assessment'}
            {step === 2 && 'Assessment Instructions'}
            {step === 3 && 'Prepare to Record'}
            {step === 4 && 'Upload or Record Video'}
            {step === 5 && 'AI Analysis'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Choose a test to begin your assessment.'}
            {step === 2 && 'Read the instructions carefully to ensure a valid assessment.'}
            {step === 3 && 'Find a clear space and set up your device.'}
            {step === 4 && 'Upload an existing video or record directly.'}
            {step === 5 && 'Our AI is analyzing your performance. Please wait.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          
          {step === 1 && <StepSelectTest tests={tests} onSelect={handleTestSelect} />}
          
          {step === 2 && selectedTest && (
            <StepInstructions 
              selectedTest={selectedTest} 
              onNext={() => setStep(3)} 
              onBack={() => setStep(1)} 
            />
          )}

          {step === 3 && (
            <StepPrepare 
              onNext={() => setStep(4)} 
              onBack={() => setStep(2)} 
            />
          )}

          {step === 4 && (
            <StepUpload 
              onUpload={handleFileUpload} 
              onBack={() => setStep(3)} 
              fileInputRef={fileInputRef} 
            />
          )}

          {step === 5 && <StepProcessing status={processStatus} />}

        </CardContent>
      </Card>
    </div>
  );
}
