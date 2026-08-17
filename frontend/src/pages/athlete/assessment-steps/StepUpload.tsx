import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { UploadCloud, Video, Film } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface Props {
  onUpload: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  onBack: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function StepUpload({ onUpload, onBack, fileInputRef }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        // Create a synthetic event object to pass to onUpload
        const syntheticEvent = {
          target: {
            files: e.dataTransfer.files
          }
        };
        onUpload(syntheticEvent);
        showToast('Video uploaded successfully!', 'success');
      } else {
        showToast('Please upload a valid video file.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div 
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.02] shadow-lg shadow-primary-500/20' 
            : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Decorative background circle */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-opacity duration-500 ${
          isDragging ? 'bg-primary-300/40 opacity-100' : 'bg-transparent opacity-0 group-hover:bg-primary-200/20 group-hover:opacity-100'
        }`} />

        <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'bg-primary-100 scale-110' : 'bg-slate-100 group-hover:bg-primary-50'}`}>
          <UploadCloud className={`h-10 w-10 transition-colors ${isDragging ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">
          {isDragging ? 'Drop video here' : 'Drag & drop your video'}
        </h3>
        
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6 relative z-10">
          <Film className="w-4 h-4" />
          <span>MP4, MOV, or WebM (Max 50MB)</span>
        </div>

        <input 
          type="file" 
          accept="video/*" 
          className="hidden" 
          ref={fileInputRef as React.RefObject<HTMLInputElement>}
          onChange={onUpload}
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="relative z-10 shadow-md"
        >
          Browse Files
        </Button>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">or</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <Button variant="secondary" className="w-full flex items-center justify-center gap-2 h-12 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300">
        <Video className="w-5 h-5 text-slate-500" /> Open Camera directly
      </Button>
      
      <div className="pt-2 flex justify-start">
        <Button variant="outline" onClick={onBack}>Back to prepare</Button>
      </div>
    </div>
  );
}
