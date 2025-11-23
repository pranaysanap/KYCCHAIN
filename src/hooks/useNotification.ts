import { useCallback } from "react";
import { useToast } from "../contexts/ToastContext";

interface NotificationOptions {
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
}

export const useNotification = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  // Authentication specific notifications
  const showLoginSuccess = useCallback(
    (userName?: string, options?: NotificationOptions) => {
      showSuccess(
        "Login Successful! ✅",
        userName
          ? `Welcome back, ${userName}! Your credentials are correct and you're now logged in.`
          : "Your credentials are correct and you're now logged in successfully.",
        options?.duration || 4000,
      );
    },
    [showSuccess],
  );

  const showLoginError = useCallback(
    (errorMessage?: string, options?: NotificationOptions) => {
      const defaultMessage =
        "Invalid email or password. Please check your credentials and try again.";
      showError(
        "Login Failed ❌",
        errorMessage || defaultMessage,
        options?.duration || 6000,
      );
    },
    [showError],
  );

  const showRegistrationSuccess = useCallback(
    (userName?: string, options?: NotificationOptions) => {
      showSuccess(
        "Registration Successful! 🎉",
        userName
          ? `Welcome to KYCChain, ${userName}! Your account has been created successfully.`
          : "Your account has been created successfully. You're now logged in!",
        options?.duration || 5000,
      );
    },
    [showSuccess],
  );

  const showRegistrationError = useCallback(
    (errorMessage?: string, options?: NotificationOptions) => {
      const defaultMessage =
        "Registration failed. This email might already be registered or there's a server issue.";
      showError(
        "Registration Failed ❌",
        errorMessage || defaultMessage,
        options?.duration || 6000,
      );
    },
    [showError],
  );

  // OTP specific notifications
  const showOTPSent = useCallback(
    (email: string, options?: NotificationOptions) => {
      showInfo(
        "OTP Sent! 📧",
        `A 6-digit verification code has been sent to ${email}. Please check your email.`,
        options?.duration || 4000,
      );
    },
    [showInfo],
  );

  const showOTPError = useCallback(
    (errorMessage?: string, options?: NotificationOptions) => {
      const defaultMessage =
        "Invalid OTP code. Please check the code in your email and try again.";
      showError(
        "OTP Verification Failed ❌",
        errorMessage || defaultMessage,
        options?.duration || 5000,
      );
    },
    [showError],
  );

  const showOTPSuccess = useCallback(
    (options?: NotificationOptions) => {
      showSuccess(
        "Email Verified! ✅",
        "Your email has been verified successfully. You can now complete your registration.",
        options?.duration || 3000,
      );
    },
    [showSuccess],
  );

  // Network and server error notifications
  const showNetworkError = useCallback(
    (options?: NotificationOptions) => {
      showError(
        "Network Error 🌐",
        "Unable to connect to the server. Please check your internet connection and try again.",
        options?.duration || 6000,
      );
    },
    [showError],
  );

  const showServerError = useCallback(
    (errorMessage?: string, options?: NotificationOptions) => {
      const defaultMessage =
        "Server error occurred. Please try again in a few moments.";
      showError(
        "Server Error ⚠️",
        errorMessage || defaultMessage,
        options?.duration || 5000,
      );
    },
    [showError],
  );

  // Credential validation notifications
  const showInvalidEmail = useCallback(
    (options?: NotificationOptions) => {
      showWarning(
        "Invalid Email Format 📧",
        "Please enter a valid email address.",
        options?.duration || 3000,
      );
    },
    [showWarning],
  );

  const showWeakPassword = useCallback(
    (options?: NotificationOptions) => {
      showWarning(
        "Weak Password 🔐",
        "Password must be at least 6 characters long and contain a mix of letters and numbers.",
        options?.duration || 4000,
      );
    },
    [showWarning],
  );

  const showPasswordMismatch = useCallback(
    (options?: NotificationOptions) => {
      showWarning(
        "Password Mismatch 🔑",
        "The passwords you entered don't match. Please check and try again.",
        options?.duration || 3000,
      );
    },
    [showWarning],
  );

  // Account specific notifications
  const showAccountLocked = useCallback(
    (options?: NotificationOptions) => {
      showError(
        "Account Locked 🔒",
        "Your account has been temporarily locked due to multiple failed login attempts. Please try again later.",
        options?.duration || 7000,
      );
    },
    [showError],
  );

  const showEmailNotVerified = useCallback(
    (options?: NotificationOptions) => {
      showWarning(
        "Email Not Verified ⚠️",
        "Please verify your email address before logging in. Check your inbox for the verification code.",
        options?.duration || 5000,
      );
    },
    [showWarning],
  );

  const showAccountExists = useCallback(
    (email: string, options?: NotificationOptions) => {
      showError(
        "Account Already Exists 👤",
        `An account with ${email} already exists. Please try logging in instead.`,
        options?.duration || 5000,
      );
    },
    [showError],
  );

  // Success operations
  const showLogoutSuccess = useCallback(
    (options?: NotificationOptions) => {
      showInfo(
        "Logged Out Successfully 👋",
        "You have been logged out safely. See you again soon!",
        options?.duration || 3000,
      );
    },
    [showInfo],
  );

  const showProfileUpdated = useCallback(
    (options?: NotificationOptions) => {
      showSuccess(
        "Profile Updated! ✅",
        "Your profile information has been updated successfully.",
        options?.duration || 3000,
      );
    },
    [showSuccess],
  );

  // Document specific notifications
  const showDocumentUploaded = useCallback(
    (documentType: string, options?: NotificationOptions) => {
      showSuccess(
        "Document Uploaded! 📄",
        `Your ${documentType} has been uploaded successfully and is being processed.`,
        options?.duration || 4000,
      );
    },
    [showSuccess],
  );

  const showDocumentVerified = useCallback(
    (documentType: string, options?: NotificationOptions) => {
      showSuccess(
        "Document Verified! ✅",
        `Your ${documentType} has been verified successfully.`,
        options?.duration || 4000,
      );
    },
    [showSuccess],
  );

  const showDocumentRejected = useCallback(
    (documentType: string, reason?: string, options?: NotificationOptions) => {
      showError(
        "Document Rejected ❌",
        `Your ${documentType} was rejected. ${reason || "Please check the document quality and try again."}`,
        options?.duration || 6000,
      );
    },
    [showError],
  );

  // General utility notifications
  const showOperationSuccess = useCallback(
    (operation: string, details?: string, options?: NotificationOptions) => {
      showSuccess(
        `${operation} Successful! ✅`,
        details || `${operation} completed successfully.`,
        options?.duration || 3000,
      );
    },
    [showSuccess],
  );

  const showOperationError = useCallback(
    (operation: string, details?: string, options?: NotificationOptions) => {
      showError(
        `${operation} Failed ❌`,
        details || `${operation} could not be completed. Please try again.`,
        options?.duration || 4000,
      );
    },
    [showError],
  );

  const showValidationError = useCallback(
    (field: string, message?: string, options?: NotificationOptions) => {
      const defaultMessage = `Please check the ${field.toLowerCase()} field and try again.`;
      showWarning(
        `Invalid ${field} ⚠️`,
        message || defaultMessage,
        options?.duration || 3000,
      );
    },
    [showWarning],
  );

  return {
    // Authentication
    showLoginSuccess,
    showLoginError,
    showRegistrationSuccess,
    showRegistrationError,

    // OTP
    showOTPSent,
    showOTPError,
    showOTPSuccess,

    // Network & Server
    showNetworkError,
    showServerError,

    // Validation
    showInvalidEmail,
    showWeakPassword,
    showPasswordMismatch,
    showValidationError,

    // Account
    showAccountLocked,
    showEmailNotVerified,
    showAccountExists,
    showLogoutSuccess,
    showProfileUpdated,

    // Documents
    showDocumentUploaded,
    showDocumentVerified,
    showDocumentRejected,

    // General
    showOperationSuccess,
    showOperationError,

    // Direct access to base toast functions
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

export default useNotification;
