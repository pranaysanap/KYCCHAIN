import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import Button from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types/auth";
import NotificationModal from "../common/NotificationModal";
import { useToast } from "../../contexts/ToastContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const { login, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!trimmedPassword) {
      setError("Password is required");
      return;
    }

    try {
      await login(
        { email: trimmedEmail, password: trimmedPassword },
        (user: User) => {
          // Show success modal and toast
          setLoggedInUser(user);
          setShowSuccessModal(true);

          showSuccess(
            "Login Successful!",
            `Welcome back, ${user.name}! You have been logged in successfully.`,
            4000,
          );
        },
      );
    } catch (err) {
      // Show error modal and toast for credential issues
      setShowErrorModal(true);

      const errorMessage =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(errorMessage);

      showError(
        "Login Failed",
        "Please check your email and password and try again.",
        5000,
      );
    }
  };

  const handleDemoLogin = async (role: "user" | "bank") => {
    const demoCredentials = {
      email: role === "user" ? "user@demo.com" : "bank@demo.com",
      password: "demo123",
    };

    setFormData(demoCredentials);
    setError("");

    try {
      await login(demoCredentials, (user: User) => {
        // Show success modal and toast
        setLoggedInUser(user);
        setShowSuccessModal(true);

        showSuccess(
          "Demo Login Successful!",
          `Welcome ${user.name}! You're now using the demo account.`,
          4000,
        );
      });
    } catch {
      setShowErrorModal(true);
      setError(
        "Demo login failed. These are mock credentials for demonstration.",
      );

      showError(
        "Demo Login Failed",
        "Demo accounts may not work with the real API. Try creating a real account.",
        5000,
      );
    }
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setError("");
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setLoggedInUser(null);
    handleClose();
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    // Don't close the main modal, let user try again
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className="glassmorphism rounded-xl p-6 sm:p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-slide-in-up border border-blue-500/20 shadow-2xl shadow-blue-500/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Login to KYCChain</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all hover:border-blue-300/50 focus:shadow-lg focus:shadow-blue-500/25"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 pr-12 transition-all hover:border-blue-300/50 focus:shadow-lg focus:shadow-blue-500/25"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 animate-shake border-glow-red">
                <p className="text-red-400 text-sm flex items-center animate-pulse">
                  <X className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              icon={
                isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : undefined
              }
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-600">
            <p className="text-gray-300 text-sm text-center mb-4">
              For testing purposes, try demo accounts:
            </p>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => handleDemoLogin("user")}
                disabled={isLoading}
              >
                Demo User
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => handleDemoLogin("bank")}
                disabled={isLoading}
              >
                Demo Bank
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Note: Demo accounts use mock credentials and may not work with
              real API
            </p>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      <NotificationModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        type="success"
        variant="login"
        userName={loggedInUser?.name}
        autoClose={true}
        autoCloseDelay={4000}
      />

      {/* Error Modal */}
      <NotificationModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        type="error"
        variant="login"
        autoClose={true}
        autoCloseDelay={5000}
      />
    </>
  );
};

export default LoginModal;
