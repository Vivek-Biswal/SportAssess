import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-600',
    icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
  },
  error: {
    bg: 'bg-red-600',
    icon: <AlertTriangle className="w-5 h-5 text-white shrink-0" />,
  },
  warning: {
    bg: 'bg-yellow-500',
    icon: <AlertTriangle className="w-5 h-5 text-white shrink-0" />,
  },
  info: {
    bg: 'bg-primary-600',
    icon: <Info className="w-5 h-5 text-white shrink-0" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    setToasts(prev => [...prev, { id, message, variant }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => {
          const style = variantStyles[toast.variant];
          return (
            <div
              key={toast.id}
              className={`${style.bg} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[420px] pointer-events-auto animate-slide-up`}
              role="alert"
            >
              {style.icon}
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-white/70 hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
