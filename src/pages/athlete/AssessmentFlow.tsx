import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { AssessmentTest } from '../../types';
import { Video, UploadCloud, CheckCircle2, Loader2, AlertCircle, BrainCircuit } from 'lucide-react';

export function AssessmentFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tests, setTests] = useState<AssessmentTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<AssessmentTest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (e.target.files && e.target.files.length > 0 && selectedTest) {
      setStep(5);
      setIsProcessing(true);
      setProcessStatus('Uploading video...');
      
      try {
        const { processId } = await api.uploadVideo(e.target.files[0], selectedTest.id);
        
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
        setProcessStatus('Analysis failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {[1, 2, 3, 4, 5, 6].map(num => (
          <div key={num} className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step >= num ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {num}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
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
            {step === 5 && 'Our AI is analyzing your performance. Please wait.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* Step 1: Select */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map(test => (
                <div 
                  key={test.id} 
                  className="border border-slate-200 rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors"
                  onClick={() => handleTestSelect(test)}
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
          )}

          {/* Step 2: Instructions */}
          {step === 2 && selectedTest && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">For the AI to accurately assess your performance, you must follow these instructions exactly. Failure to do so may result in an invalid assessment.</p>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Ensure full body is visible in the frame at all times.</li>
                <li>Place camera at waist height, roughly 3 meters away.</li>
                <li>Ensure good lighting; avoid recording against bright windows.</li>
                <li>Wear contrasting clothes to the background.</li>
              </ul>
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>I Understand, Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: Prepare */}
          {step === 3 && (
            <div className="text-center space-y-6 py-8">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Video className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-medium">Ready your camera</h3>
              <p className="text-slate-500 max-w-md mx-auto">Prop your phone against a stable surface. You will have a 10-second countdown before recording begins.</p>
              <div className="pt-4 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Ready</Button>
              </div>
            </div>
          )}

          {/* Step 4: Upload/Record */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                <UploadCloud className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Upload your video</h3>
                <p className="text-sm text-slate-500 mb-4">MP4, MOV, WebM up to 50MB</p>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <Button onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
              </div>
              <div className="text-center">
                <span className="text-slate-500 text-sm">or</span>
              </div>
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Video className="w-4 h-4" /> Open Camera (Demo Only)
              </Button>
              <div className="pt-4 flex justify-start">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              </div>
            </div>
          )}

          {/* Step 5: AI Processing */}
          {step === 5 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="h-24 w-24 rounded-full flex items-center justify-center bg-white z-10 relative">
                  <BrainCircuit className="h-10 w-10 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Video</h3>
                <p className="text-slate-500 animate-pulse">{processStatus}</p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
