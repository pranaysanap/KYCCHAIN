import React, { createContext, useContext, useState, useCallback } from "react";
import SuccessToast from "../components/common/SuccessToast";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = generateId();
      const newToast: Toast = {
        id,
        ...toast,
        duration: toast.duration || 4000,
        position: toast.position || "top-right",
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    },
    [generateId],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "success", title, message, duration });
    },
    [showToast],
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "error", title, message, duration });
    },
    [showToast],
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "info", title, message, duration });
    },
    [showToast],
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "warning", title, message, duration });
    },
    [showToast],
  );

  // Group toasts by position
  const getToastsByPosition = (position: Toast["position"]) => {
    return toasts.filter((toast) => toast.position === position);
  };

  const positions: Toast["position"][] = [
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
    "top-center",
  ];

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeToast,
        clearAll,
      }}
    >
      {children}

      {/* Render toasts grouped by position */}
      {positions.map((position) => {
        const positionToasts = getToastsByPosition(position);
        if (positionToasts.length === 0) return null;

        return (
          <div
            key={position}
            className={`fixed z-50 ${getPositionClasses(position)}`}
          >
            <div className="space-y-2">
              {positionToasts.map((toast) => (
                <SuccessToast
                  key={toast.id}
                  isVisible={true}
                  onClose={() => removeToast(toast.id)}
                  type={toast.type}
                  title={toast.title}
                  message={toast.message}
                  duration={toast.duration}
                  position={toast.position}
                />
              ))}
            </div>
          </div>
        );
      })}
    </ToastContext.Provider>
  );
};

function getPositionClasses(position: Toast["position"]) {
  switch (position) {
    case "top-right":
      return "top-4 right-4";
    case "top-left":
      return "top-4 left-4";
    case "bottom-right":
      return "bottom-4 right-4";
    case "bottom-left":
      return "bottom-4 left-4";
    case "top-center":
      return "top-4 left-1/2 transform -translate-x-1/2";
    default:
      return "top-4 right-4";
  }
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
