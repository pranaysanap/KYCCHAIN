import React, { useEffect, useState } from "react";
import { CheckCircle, X, Sparkles, ArrowRight } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "registration";
  userName?: string;
  message?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  type,
  userName,
  message,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay content animation to create a nice entrance effect
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowConfetti(true), 200);

      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setShowContent(false);
      setShowConfetti(false);
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setShowContent(false);
    setShowConfetti(false);
    setTimeout(onClose, 300); // Delay to allow exit animation
  };

  const getSuccessContent = () => {
    switch (type) {
      case "registration":
        return {
          title: "Welcome to KYCChain!",
          subtitle: userName
            ? `Welcome aboard, ${userName}!`
            : "Account created successfully",
          description:
            message ||
            "Your account has been created successfully. You are now logged in and ready to start your KYC journey.",
          icon: "🎉",
          buttonText: "Get Started",
        };
      case "login":
        return {
          title: "Welcome Back!",
          subtitle: userName
            ? `Good to see you, ${userName}!`
            : "Login successful",
          description:
            message ||
            "You have successfully logged into your KYCChain account. Access your dashboard and manage your documents securely.",
          icon: "👋",
          buttonText: "Go to Dashboard",
        };
      default:
        return {
          title: "Success!",
          subtitle: "Operation completed successfully",
          description:
            message || "Your request has been processed successfully.",
          icon: "✅",
          buttonText: "Continue",
        };
    }
  };

  const content = getSuccessContent();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti opacity-75"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className={`w-4 h-4 ${
                  i % 4 === 0
                    ? "text-blue-400"
                    : i % 4 === 1
                      ? "text-green-400"
                      : i % 4 === 2
                        ? "text-yellow-400"
                        : "text-pink-400"
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div
        className={`
          relative glassmorphism rounded-2xl p-8 w-full max-w-md mx-4 text-center
          transform transition-all duration-500 ease-out
          ${
            showContent
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-8"
          }
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon with Animation */}
        <div className="mb-6">
          <div
            className={`
              inline-flex items-center justify-center w-20 h-20 rounded-full
              bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30
              transform transition-all duration-700 ease-out
              ${showContent ? "scale-100 rotate-0" : "scale-0 rotate-180"}
            `}
          >
            <CheckCircle
              className={`
                w-10 h-10 text-green-400
                transform transition-all duration-500 ease-out delay-300
                ${showContent ? "scale-100" : "scale-0"}
              `}
            />
          </div>

          {/* Pulse Ring Animation */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center mt-6
              ${showContent ? "animate-ping" : ""}
            `}
          >
            <div className="w-20 h-20 rounded-full bg-green-400/20 animate-pulse"></div>
          </div>
        </div>

        {/* Success Text Content */}
        <div
          className={`
            transform transition-all duration-600 ease-out delay-200
            ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          {/* Emoji */}
          <div className="text-4xl mb-4 animate-bounce">{content.icon}</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {content.title}
          </h2>

          {/* Subtitle */}
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            {content.subtitle}
          </h3>

          {/* Description */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Action Button */}
        <div
          className={`
            transform transition-all duration-700 ease-out delay-400
            ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          <button
            onClick={handleClose}
            className="
              group inline-flex items-center justify-center space-x-2 px-8 py-3
              bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600
              text-white font-medium rounded-lg
              transform transition-all duration-200 ease-out
              hover:scale-105 hover:shadow-lg hover:shadow-green-500/25
              focus:outline-none focus:ring-2 focus:ring-green-400/50
            "
          >
            <span>{content.buttonText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Auto-close Indicator */}
        {autoClose && (
          <div className="mt-6 text-xs text-gray-500">
            This will close automatically in {Math.ceil(autoCloseDelay / 1000)}{" "}
            seconds
          </div>
        )}

        {/* Background Gradient Animation */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div
            className={`
              absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5
              transform transition-all duration-1000 ease-out
              ${showContent ? "scale-100 opacity-100" : "scale-110 opacity-0"}
            `}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
