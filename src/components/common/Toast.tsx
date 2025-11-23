import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: {
      container: 'bg-gradient-to-r from-emerald-500 to-green-600',
      icon: 'text-white',
      progress: 'bg-emerald-200',
    },
    error: {
      container: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: 'text-white',
      progress: 'bg-red-200',
    },
    warning: {
      container: 'bg-gradient-to-r from-amber-500 to-orange-600',
      icon: 'text-white',
      progress: 'bg-amber-200',
    },
    info: {
      container: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: 'text-white',
      progress: 'bg-blue-200',
    },
  };

  const Icon = icons[type];
  const style = styles[type];

  return (
    <div
      className={`${style.container} rounded-xl shadow-2xl p-4 min-w-[320px] max-w-md animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`${style.icon} flex-shrink-0 mt-0.5`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 text-white hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full ${style.progress} animate-progress-shrink`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Simple Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>>([]);

  const showToast = React.useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    warning: (message: string) => showToast('warning', message),
    info: (message: string) => showToast('info', message),
  };
};

export default Toast;
