import React from 'react';
import { UserPlus, Dumbbell, Video, BrainCircuit, Award } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';

export function HowItWorks() {
  const steps = [
    {
      title: 'Create Profile',
      description: 'Sign up and build your athlete profile with basic details and sports interests.',
      icon: <UserPlus className="h-8 w-8 text-primary-600" />,
    },
    {
      title: 'Select Assessment',
      description: 'Choose from standardized tests like Vertical Jump, Shuttle Run, or Sit-Ups.',
      icon: <Dumbbell className="h-8 w-8 text-blue-600" />,
    },
    {
      title: 'Record & Upload',
      description: 'Follow the specific test instructions and record your performance video.',
      icon: <Video className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: 'AI Verification',
      description: 'Our computer vision system analyzes movement and calculates your performance metrics.',
      icon: <BrainCircuit className="h-8 w-8 text-purple-600" />,
    },
    {
      title: 'Receive Results',
      description: 'Get verified scores, see national benchmarks, and earn performance badges.',
      icon: <Award className="h-8 w-8 text-yellow-600" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h1>
        <p className="text-lg text-slate-600">The assessment process is designed to be simple, fair, and accessible to everyone.</p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0 flex flex-col md:flex-row items-center">
              <div className="bg-slate-50 p-8 flex items-center justify-center md:w-48 h-full border-b md:border-b-0 md:border-r border-slate-200">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl font-black text-slate-200">{index + 1}</span>
                  {step.icon}
                </div>
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
