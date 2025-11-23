import React, { useState } from "react";
import NotificationModal from "../common/NotificationModal";
import { useNotification } from "../../hooks/useNotification";
import Button from "../common/Button";
import { Play, User, LogIn, AlertTriangle, CheckCircle, Info, Mail } from "lucide-react";

const NotificationDemo: React.FC = () => {
  const [showSuccessLoginModal, setShowSuccessLoginModal] = useState(false);
  const [showErrorLoginModal, setShowErrorLoginModal] = useState(false);
  const [showSuccessRegModal, setShowSuccessRegModal] = useState(false);
  const [showErrorRegModal, setShowErrorRegModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const {
    showLoginSuccess,
    showLoginError,
    showRegistrationSuccess,
    showRegistrationError,
    showOTPSent,
    showOTPError,
    showOTPSuccess,
    showNetworkError,
    showServerError,
    showInvalidEmail,
    showWeakPassword,
    showPasswordMismatch,
    showAccountLocked,
    showEmailNotVerified,
    showAccountExists,
    showLogoutSuccess,
    showProfileUpdated,
    showDocumentUploaded,
    showDocumentVerified,
    showDocumentRejected,
  } = useNotification();

  const demoUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  };

  const handleAuthToasts = () => {
    showLoginSuccess("John Doe");

    setTimeout(() => {
      showRegistrationSuccess("Jane Smith");
    }, 1000);

    setTimeout(() => {
      showLoginError("Invalid email or password. Please check your credentials.");
    }, 2000);

    setTimeout(() => {
      showRegistrationError("Email already exists in our system.");
    }, 3000);
  };

  const handleOTPToasts = () => {
    showOTPSent("user@example.com");

    setTimeout(() => {
      showOTPError("Invalid OTP code. Please try again.");
    }, 1500);

    setTimeout(() => {
      showOTPSuccess();
    }, 3000);
  };

  const handleValidationToasts = () => {
    showInvalidEmail();

    setTimeout(() => {
      showWeakPassword();
    }, 1000);

    setTimeout(() => {
      showPasswordMismatch();
    }, 2000);
  };

  const handleAccountToasts = () => {
    showAccountLocked();

    setTimeout(() => {
      showEmailNotVerified();
    }, 1500);

    setTimeout(() => {
      showAccountExists("user@example.com");
    }, 3000);
  };

  const handleOperationToasts = () => {
    showLogoutSuccess();

    setTimeout(() => {
      showProfileUpdated();
    }, 1000);

    setTimeout(() => {
      showDocumentUploaded("Passport");
    }, 2000);

    setTimeout(() => {
      showDocumentVerified("Driver's License");
    }, 3000);

    setTimeout(() => {
      showDocumentRejected("ID Card", "Image quality too low");
    }, 4000);
  };

  const handleErrorToasts = () => {
    showNetworkError();

    setTimeout(() => {
      showServerError("Database connection failed");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            KYCChain Notification System Demo
          </h1>
          <p className="text-gray-300 text-lg">
            Test all notification modals and toast types for authentication feedback
          </p>
        </div>

        {/* Success/Error Modal Demos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Login Success Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Login Success Modal
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Show animated success modal with confetti after successful login
              </p>
            </div>
            <Button
              onClick={() => setShowSuccessLoginModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Login Success
            </Button>
          </div>

          {/* Login Error Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Login Error Modal
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Show error modal for failed login with clear messaging
              </p>
            </div>
            <Button
              onClick={() => setShowErrorLoginModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Login Error
            </Button>
          </div>

          {/* Registration Success Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <User className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Registration Success
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Celebrate successful account creation with confetti
              </p>
            </div>
            <Button
              onClick={() => setShowSuccessRegModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Registration Success
            </Button>
          </div>

          {/* Registration Error Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Registration Error
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Handle registration failures with helpful error messages
              </p>
            </div>
            <Button
              onClick={() => setShowErrorRegModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Registration Error
            </Button>
          </div>

          {/* Info Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <Info className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Info Modal
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Display important information to users
              </p>
            </div>
            <Button
              onClick={() => setShowInfoModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Info Modal
            </Button>
          </div>
        </div>

        {/* Toast Notification Demos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Authentication Toasts */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <LogIn className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Authentication Toasts
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Login and registration feedback notifications
              </p>
            </div>
            <Button
              onClick={handleAuthToasts}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Auth Notifications
            </Button>
          </div>

          {/* OTP Toasts */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <Mail className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                OTP Notifications
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Email verification and OTP-related notifications
              </p>
            </div>
            <Button
              onClick={handleOTPToasts}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show OTP Notifications
            </Button>
          </div>

          {/* Validation Toasts */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Validation Warnings
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Form validation and input error notifications
              </p>
            </div>
            <Button
              onClick={handleValidationToasts}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Validation Warnings
            </Button>
          </div>

          {/* Account Toasts */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <User className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Account Notifications
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Account status and security-related notifications
              </p>
            </div>
            <Button
              onClick={handleAccountToasts}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Account Notifications
            </Button>
          </div>

          {/* Operation Toasts */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Operation Results
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Document uploads, verifications, and general operations
              </p>
            </div>
            <Button
              onClick={handleOperationToasts}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Operation Results
            </Button>
          </div>

          {/* Error Toasts */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                System Errors
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Network and server error notifications
              </p>
            </div>
            <Button
              onClick={handleErrorToasts}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Error Notifications
            </Button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="glassmorphism p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Notification System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Success Feedback</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✅ Confetti animations</li>
                <li>✅ Personalized messages</li>
                <li>✅ Auto-close timers</li>
                <li>✅ Success toasts</li>
              </ul>
            </div>
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Error Handling</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>❌ Clear error messages</li>
                <li>❌ Credential validation</li>
                <li>❌ Network error detection</li>
                <li>❌ Retry guidance</li>
              </ul>
            </div>
            <div className="text-center">
              <Info className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">User Experience</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>ℹ️ Animated transitions</li>
                <li>ℹ️ Multiple toast positions</li>
                <li>ℹ️ Progress indicators</li>
                <li>ℹ️ Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email Configuration Notice */}
        <div className="mt-8 glassmorphism p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Email Configuration</h3>
          </div>
          <div className="bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-300 text-sm mb-2">
              📧 <strong>Sender Email:</strong> ratyat416@gmail.com
            </p>
            <p className="text-gray-300 text-sm">
              All OTP and notification emails are sent from this verified Mailjet sender address.
              Users will clearly see when login/registration is successful or if credentials are incorrect.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Modals */}
      <NotificationModal
        isOpen={showSuccessLoginModal}
        onClose={() => setShowSuccessLoginModal(false)}
        type="success"
        variant="login"
        userName={demoUser.name}
        autoClose={true}
        autoCloseDelay={4000}
      />

      <NotificationModal
        isOpen={showErrorLoginModal}
        onClose={() => setShowErrorLoginModal(false)}
        type="error"
        variant="login"
        autoClose={true}
        autoCloseDelay={5000}
      />

      <NotificationModal
        isOpen={showSuccessRegModal}
        onClose={() => setShowSuccessRegModal(false)}
        type="success"
        variant="registration"
        userName={demoUser.name}
        autoClose={true}
        autoCloseDelay={4000}
      />

      <NotificationModal
        isOpen={showErrorRegModal}
        onClose={() => setShowErrorRegModal(false)}
        type="error"
        variant="registration"
        autoClose={true}
        autoCloseDelay={5000}
      />

      <NotificationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        type="info"
        title="Important Information"
        message="Your KYC verification process has been initiated. You will receive email updates about the status of your document verification."
        autoClose={true}
        autoCloseDelay={4000}
      />
    </div>
  );
};

export default NotificationDemo;
