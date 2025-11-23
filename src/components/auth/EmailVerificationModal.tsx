import React, { useState, useRef, useEffect } from "react";
import { X, Mail, ArrowLeft, Loader2 } from "lucide-react";
import Button from "../common/Button";
import { apiService } from "../../services/api";
import { useNotification } from "../../hooks/useNotification";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (email: string) => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
}) => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showOTPSent, showOTPError, showOTPSuccess } = useNotification();

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Handle countdown for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("email");
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setResendCountdown(0);
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiService.sendOTP({ email });
      setStep("otp");
      setResendCountdown(60); // 60 seconds countdown

      // Show success toast
      showOTPSent(email);

      // Focus first OTP input after a short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send OTP";
      setError(errorMessage);
      showOTPError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, 6);

    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);

      // Focus next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiService.verifyOTP({ email, otp: otpString });
      if (response.verified) {
        showOTPSuccess();
        onVerificationSuccess(email);
        onClose();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid OTP";
      setError(errorMessage);
      showOTPError(errorMessage);
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;

    setError("");
    setLoading(true);

    try {
      await apiService.sendOTP({ email });
      setResendCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Show success toast for resend
      showOTPSent(email);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      setError(errorMessage);
      showOTPError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep("email");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glassmorphism rounded-xl p-6 sm:p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-slide-in-up border border-blue-500/20 shadow-2xl shadow-blue-500/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            {step === "otp" && (
              <button
                onClick={goBackToEmail}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white">
              {step === "email"
                ? "Email Verification"
                : "Enter Verification Code"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-gray-300">
                Enter your email address to receive a verification code
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all hover:border-blue-300/50 focus:shadow-lg focus:shadow-blue-500/25"
                placeholder="Enter your email address"
                required
                autoComplete="email"
              />
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
              loading={loading}
              icon={
                loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : undefined
              }
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-gray-300">We've sent a 6-digit code to</p>
              <p className="text-white font-medium">{email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={handleOTPPaste}
                    className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    style={{
                      animation: digit ? "pulse 0.3s ease-out" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4 animate-shake border-glow-red">
                <p className="text-red-400 text-sm text-center flex items-center justify-center animate-pulse">
                  <X className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <Button
              onClick={handleVerifyOTP}
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={otp.some((digit) => !digit)}
              icon={
                loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : undefined
              }
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={resendCountdown > 0 || loading}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : "Resend Code"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationModal;
