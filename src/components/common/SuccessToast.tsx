import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface SuccessToastProps {
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

const SuccessToast: React.FC<SuccessToastProps> = ({
  isVisible,
  onClose,
  type = 'success',
  title,
  message,
  duration = 4000,
  position = 'top-right'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);

      // Auto close after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-900/90 border-green-500/50',
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          accent: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-900/90 border-red-500/50',
          icon: <AlertCircle className="w-5 h-5 text-red-400" />,
          accent: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/90 border-yellow-500/50',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          accent: 'bg-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-900/90 border-blue-500/50',
          icon: <Info className="w-5 h-5 text-blue-400" />,
          accent: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-green-900/90 border-green-500/50',
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          accent: 'bg-green-500'
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getAnimationClasses = () => {
    const isTop = position.includes('top');
    const isRight = position.includes('right');
    const isCenter = position.includes('center');

    if (isCenter) {
      return isAnimating
        ? 'translate-y-0 opacity-100'
        : '-translate-y-full opacity-0';
    }

    if (isTop) {
      return isAnimating
        ? 'translate-y-0 opacity-100'
        : isRight
          ? '-translate-y-2 translate-x-2 opacity-0'
          : '-translate-y-2 -translate-x-2 opacity-0';
    } else {
      return isAnimating
        ? 'translate-y-0 opacity-100'
        : isRight
          ? 'translate-y-2 translate-x-2 opacity-0'
          : 'translate-y-2 -translate-x-2 opacity-0';
    }
  };

  const typeStyles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div className={`fixed z-50 ${getPositionStyles()}`}>
      <div
        className={`
          relative min-w-80 max-w-md p-4 rounded-lg backdrop-blur-sm border
          shadow-lg ${typeStyles.bg}
          transform transition-all duration-300 ease-out
          ${getAnimationClasses()}
        `}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-gray-700 rounded-t-lg w-full overflow-hidden">
          <div
            className={`h-full ${typeStyles.accent} animate-progress-bar`}
            style={{
              animation: `progressBar ${duration}ms linear forwards`
            }}
          />
        </div>

        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {typeStyles.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-lg ${typeStyles.accent} opacity-20 blur-xl -z-10`} />
      </div>

      <style>{`
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-progress-bar {
          transform-origin: left;
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;
