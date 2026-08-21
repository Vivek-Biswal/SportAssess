import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { UploadCloud, Video, Film, Camera, Square, Check, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface Props {
  onUpload: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  onBack: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function StepUpload({ onUpload, onBack, fileInputRef }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<'select' | 'camera' | 'review'>('select');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

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
        onUpload({ target: { files: e.dataTransfer.files } });
      } else {
        showToast('Please upload a valid video file.', 'error');
      }
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      setMode('camera');
    } catch (err) {
      showToast('Camera access denied or unavailable.', 'error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setMode('select');
  };

  useEffect(() => {
    if (mode === 'camera' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [mode, stream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  const startRecordingFlow = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          startRecording();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setMode('review');
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const confirmRecording = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'capture.webm', { type: 'video/webm' });
      // Create synthetic event
      const dt = new DataTransfer();
      dt.items.add(file);
      onUpload({ target: { files: dt.files } });
    }
  };

  const retakeRecording = () => {
    setRecordedBlob(null);
    setMode('camera');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === 'camera') {
    return (
      <div className="space-y-4 animate-fade-in flex flex-col items-center w-full">
        <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Framing Guide Overlay */}
          {!isRecording && (
            <div className="absolute inset-0 border-2 border-dashed border-white/50 m-8 rounded">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                Keep full body in frame
              </div>
            </div>
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-8xl font-bold text-white animate-pulse">{countdown}</span>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-mono">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-4 w-full justify-center">
          {!isRecording && countdown === null ? (
            <>
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
              <Button onClick={startRecordingFlow} className="bg-red-600 hover:bg-red-700 text-white">
                <Camera className="w-4 h-4 mr-2" /> Record
              </Button>
            </>
          ) : isRecording ? (
            <Button onClick={stopRecording} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
              <Square className="w-4 h-4 mr-2 fill-current" /> Stop
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  if (mode === 'review') {
    return (
      <div className="space-y-4 animate-fade-in flex flex-col items-center w-full">
        <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-lg overflow-hidden">
          {recordedBlob && (
            <video src={URL.createObjectURL(recordedBlob)} controls className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
        <div className="flex gap-4 w-full justify-center">
          <Button variant="outline" onClick={retakeRecording}>
            <X className="w-4 h-4 mr-2" /> Retake
          </Button>
          <Button onClick={confirmRecording}>
            <Check className="w-4 h-4 mr-2" /> Use Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
            : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`p-4 rounded-full mb-4 transition-transform duration-300 ${isDragging ? 'bg-primary-100 scale-110' : 'bg-slate-100 group-hover:bg-primary-50'}`}>
          <UploadCloud className={`h-10 w-10 transition-colors ${isDragging ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-500'}`} />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">
          {isDragging ? 'Drop video here' : 'Upload existing video'}
        </h3>
        
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6 relative z-10">
          <Film className="w-4 h-4" />
          <span>MP4, MOV, or WebM (Max 4.5MB)</span>
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
          className="relative z-10 shadow-sm"
        >
          Browse Files
        </Button>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">or</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <Button onClick={startCamera} variant="outline" className="w-full flex items-center justify-center gap-2 h-12 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition-all hover:border-slate-400">
        <Video className="w-5 h-5 text-slate-500" /> Record directly (Camera)
      </Button>
      
      <div className="pt-2 flex justify-start">
        <Button variant="ghost" onClick={onBack}>Back to preparation</Button>
      </div>
    </div>
  );
}
