import React, { useState } from "react";
import SuccessModal from "../common/SuccessModal";
import { useToast } from "../../contexts/ToastContext";
import Button from "../common/Button";
import { Play, User, LogIn, CheckCircle, Sparkles } from "lucide-react";

const SuccessModalDemo: React.FC = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const { showSuccess, showError, showInfo, showWarning } = useToast();

  const demoUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  };

  const handleShowToasts = () => {
    showSuccess("Success Toast!", "This is a success notification with confetti effect.");

    setTimeout(() => {
      showInfo("Info Toast", "This provides information to the user.");
    }, 1000);

    setTimeout(() => {
      showWarning("Warning Toast", "This warns about potential issues.");
    }, 2000);

    setTimeout(() => {
      showError("Error Toast", "This shows error messages to users.");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Success Modal & Toast Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Registration Success Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Registration Success
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Show animated success modal after user registration
              </p>
            </div>
            <Button
              onClick={() => setShowRegistrationModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Registration Success
            </Button>
          </div>

          {/* Login Success Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <LogIn className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Login Success
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Welcome back modal with personalized message
              </p>
            </div>
            <Button
              onClick={() => setShowLoginModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Login Success
            </Button>
          </div>

          {/* Custom Success Modal */}
          <div className="glassmorphism p-6 rounded-xl">
            <div className="text-center mb-4">
              <CheckCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Custom Success
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Custom success modal with different messaging
              </p>
            </div>
            <Button
              onClick={() => setShowCustomModal(true)}
              variant="primary"
              className="w-full"
              icon={<Play className="w-4 h-4" />}
            >
              Show Custom Success
            </Button>
          </div>

          {/* Toast Notifications */}
          <div className="glassmorphism p-6 rounded-xl md:col-span-2 lg:col-span-3">
            <div className="text-center mb-4">
              <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Toast Notifications
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Show different types of toast notifications (Success, Info, Warning, Error)
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleShowToasts}
                variant="primary"
                className="px-8"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Show All Toast Types
              </Button>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 glassmorphism p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Success Modal Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Animated confetti particles</li>
                <li>✅ Smooth scale and fade animations</li>
                <li>✅ Personalized welcome messages</li>
                <li>✅ Auto-close with countdown</li>
                <li>✅ Gradient backgrounds and effects</li>
                <li>✅ Emoji and icon animations</li>
                <li>✅ Customizable content per type</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Toast Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Multiple toast types (Success, Error, Info, Warning)</li>
                <li>✅ Position flexibility (5 positions)</li>
                <li>✅ Progress bar animation</li>
                <li>✅ Auto-dismiss with timer</li>
                <li>✅ Manual close option</li>
                <li>✅ Stacking support</li>
                <li>✅ Smooth enter/exit animations</li>
                <li>✅ Backdrop blur effects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 glassmorphism p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Examples</h2>
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">Registration Success</h4>
              <code className="text-sm text-gray-300">
                {`<SuccessModal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  type="registration"
  userName="John Doe"
  autoClose={true}
  autoCloseDelay={4000}
/>`}
              </code>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Login Success</h4>
              <code className="text-sm text-gray-300">
                {`<SuccessModal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  type="login"
  userName="John Doe"
  autoClose={true}
  autoCloseDelay={3000}
/>`}
              </code>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">Toast Notification</h4>
              <code className="text-sm text-gray-300">
                {`const { showSuccess } = useToast();
showSuccess("Success!", "Operation completed successfully.");`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modals */}
      <SuccessModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        type="registration"
        userName={demoUser.name}
        autoClose={true}
        autoCloseDelay={4000}
      />

      <SuccessModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        type="login"
        userName={demoUser.name}
        autoClose={true}
        autoCloseDelay={3000}
      />

      <SuccessModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        type="registration"
        userName={demoUser.name}
        message="Your KYC verification has been completed successfully! You can now access all premium features."
        autoClose={false}
      />
    </div>
  );
};

export default SuccessModalDemo;
