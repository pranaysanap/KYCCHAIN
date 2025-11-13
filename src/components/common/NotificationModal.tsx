import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  X,
  Sparkles,
  ArrowRight,
  XCircle,
  Info,
} from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "info";
  variant?: "login" | "registration" | "custom";
  userName?: string;
  title?: string;
  message?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  variant = "custom",
  userName,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClose = () => {
    setShowContent(false);
    setShowConfetti(false);
    setTimeout(onClose, 300); // Delay to allow exit animation
  };

  useEffect(() => {
    if (isOpen) {
      // Delay content animation to create a nice entrance effect
      setTimeout(() => setShowContent(true), 100);
      if (type === "success") {
        setTimeout(() => setShowConfetti(true), 200);
      }

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
  }, [isOpen, autoClose, autoCloseDelay, type, handleClose]);

  const getNotificationContent = () => {
    if (title && message) {
      // Custom content provided
      return {
        title,
        subtitle: userName ? `${userName}` : "",
        description: message,
        icon: type === "success" ? "🎉" : type === "error" ? "❌" : "ℹ️",
        buttonText:
          type === "success"
            ? "Continue"
            : type === "error"
              ? "Try Again"
              : "OK",
      };
    }

    // Default content based on type and variant
    switch (type) {
      case "success":
        if (variant === "registration") {
          return {
            title: "Registration Successful! 🎉",
            subtitle: userName
              ? `Welcome to KYCChain, ${userName}!`
              : "Account created successfully",
            description:
              "Your account has been created and you're now logged in. You can start using all KYCChain features immediately.",
            icon: "🎉",
            buttonText: "Start Your KYC Journey",
          };
        } else if (variant === "login") {
          return {
            title: "Login Successful! ✅",
            subtitle: userName
              ? `Welcome back, ${userName}!`
              : "Successfully logged in",
            description:
              "You have been successfully authenticated. Your credentials are correct and you're now logged into your account.",
            icon: "👋",
            buttonText: "Go to Dashboard",
          };
        }
        break;

      case "error":
        if (variant === "login") {
          return {
            title: "Login Failed ❌",
            subtitle: "Invalid Credentials",
            description:
              "The email or password you entered is incorrect. Please check your credentials and try again. Make sure your caps lock is off.",
            icon: "🔐",
            buttonText: "Try Again",
          };
        } else if (variant === "registration") {
          return {
            title: "Registration Failed ❌",
            subtitle: "Unable to Create Account",
            description:
              "There was an error creating your account. This email might already be registered or there's a server issue. Please try again.",
            icon: "⚠️",
            buttonText: "Try Again",
          };
        }
        break;

      case "info":
        return {
          title: "Information ℹ️",
          subtitle: "Please Note",
          description: message || "Here's some important information for you.",
          icon: "💡",
          buttonText: "Understood",
        };

      default:
        return {
          title: "Notification",
          subtitle: "",
          description: message || "Operation completed.",
          icon: "ℹ️",
          buttonText: "OK",
        };
    }

    // Fallback
    return {
      title: "Notification",
      subtitle: "",
      description: message || "Operation completed.",
      icon: "ℹ️",
      buttonText: "OK",
    };
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "from-green-500/20 to-blue-500/20",
          border: "border-green-500/30",
          iconBg:
            "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30",
          iconColor: "text-green-400",
          titleColor:
            "bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent",
          buttonBg:
            "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
          buttonShadow: "hover:shadow-green-500/25",
          pulseColor: "bg-green-400/20",
        };
      case "error":
        return {
          bg: "from-red-500/20 to-orange-500/20",
          border: "border-red-500/30",
          iconBg:
            "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30",
          iconColor: "text-red-400",
          titleColor:
            "bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent",
          buttonBg:
            "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
          buttonShadow: "hover:shadow-red-500/25",
          pulseColor: "bg-red-400/20",
        };
      case "info":
        return {
          bg: "from-blue-500/20 to-purple-500/20",
          border: "border-blue-500/30",
          iconBg:
            "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30",
          iconColor: "text-blue-400",
          titleColor:
            "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
          buttonBg:
            "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
          buttonShadow: "hover:shadow-blue-500/25",
          pulseColor: "bg-blue-400/20",
        };
      default:
        return {
          bg: "from-gray-500/20 to-gray-600/20",
          border: "border-gray-500/30",
          iconBg:
            "bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30",
          iconColor: "text-gray-400",
          titleColor: "text-white",
          buttonBg:
            "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
          buttonShadow: "hover:shadow-gray-500/25",
          pulseColor: "bg-gray-400/20",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-10 h-10 text-green-400" />;
      case "error":
        return <XCircle className="w-10 h-10 text-red-400" />;
      case "info":
        return <Info className="w-10 h-10 text-blue-400" />;
      default:
        return <CheckCircle className="w-10 h-10 text-gray-400" />;
    }
  };

  const content = getNotificationContent();
  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Confetti Animation - Only for success */}
      {showConfetti && type === "success" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti opacity-75"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <Sparkles
                className={`w-4 h-4 ${
                  i % 5 === 0
                    ? "text-blue-400"
                    : i % 5 === 1
                      ? "text-green-400"
                      : i % 5 === 2
                        ? "text-yellow-400"
                        : i % 5 === 3
                          ? "text-pink-400"
                          : "text-purple-400"
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
          border ${styles.border}
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
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10 p-1 rounded-full hover:bg-gray-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon with Animation */}
        <div className="mb-6 relative">
          <div
            className={`
              inline-flex items-center justify-center w-20 h-20 rounded-full
              ${styles.iconBg} border
              transform transition-all duration-700 ease-out
              ${showContent ? "scale-100 rotate-0" : "scale-0 rotate-180"}
            `}
          >
            {getIcon()}
          </div>

          {/* Pulse Ring Animation */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              ${showContent ? "animate-ping" : ""}
            `}
          >
            <div
              className={`w-20 h-20 rounded-full ${styles.pulseColor} animate-pulse`}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`
            transform transition-all duration-600 ease-out delay-200
            ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          {/* Emoji */}
          <div
            className={`text-4xl mb-4 ${type === "success" ? "animate-bounce" : ""}`}
          >
            {content.icon}
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold mb-2 ${styles.titleColor}`}>
            {content.title}
          </h2>

          {/* Subtitle */}
          {content.subtitle && (
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              {content.subtitle}
            </h3>
          )}

          {/* Description */}
          <p className="text-gray-300 mb-8 leading-relaxed text-sm">
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
            className={`
              group inline-flex items-center justify-center space-x-2 px-8 py-3
              ${styles.buttonBg} text-white font-medium rounded-lg
              transform transition-all duration-200 ease-out
              hover:scale-105 hover:shadow-lg ${styles.buttonShadow}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${
                type === "success"
                  ? "focus:ring-green-400"
                  : type === "error"
                    ? "focus:ring-red-400"
                    : "focus:ring-blue-400"
              }
            `}
          >
            <span>{content.buttonText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Auto-close Indicator */}
        {autoClose && (
          <div className="mt-6 text-xs text-gray-500">
            Auto-closing in {Math.ceil(autoCloseDelay / 1000)} seconds
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div
                className={`h-1 rounded-full ${
                  type === "success"
                    ? "bg-green-400"
                    : type === "error"
                      ? "bg-red-400"
                      : "bg-blue-400"
                }`}
                style={{
                  animation: `shrinkWidth ${autoCloseDelay}ms linear forwards`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Background Gradient Animation */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div
            className={`
              absolute inset-0 bg-gradient-to-r ${styles.bg}
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
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        @keyframes shrinkWidth {
          from {
            width: 100%;
          }
          to {
            width: 0%;
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

export default NotificationModal;
