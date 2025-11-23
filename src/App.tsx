import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import Features from "./components/landing/Features";
import Workflow from "./components/landing/Workflow";
import Contact from "./components/landing/Contact";
import Footer from "./components/landing/Footer";
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";
import EmailVerificationModal from "./components/auth/EmailVerificationModal";
import LiveChatWidget from "./components/common/LiveChatWidget";
import Sidebar from "./components/layout/Sidebar";
import UserDashboard from "./components/dashboard/UserDashboard";
import DocumentsPage from "./pages/user/DocumentsPage";
import ConsentPage from "./pages/user/ConsentPage";
import FraudAlertsPage from "./pages/user/FraudAlertsPage";
import ProfilePage from "./pages/user/ProfilePage";
import BankVerificationPage from "./pages/user/BankVerificationPage";
import VerificationLogsPage from "./pages/user/VerificationLogsPage";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | undefined>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { register, setEmailVerified, clearEmailVerification } = useAuth();
  const { showToast } = useToast();

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetStarted = () => {
    setShowEmailVerificationModal(true);
  };

  const handleEmailVerificationSuccess = (email: string) => {
    setVerifiedEmail(email);
    setEmailVerified(email);
    setShowEmailVerificationModal(false);
    setShowRegisterModal(true);
  };

  const handleLoginClick = () => {
    console.log("=== LOGIN BUTTON CLICKED ===");
    console.log(
      "Current state - Login:",
      showLoginModal,
      "Register:",
      showRegisterModal,
      "Email:",
      showEmailVerificationModal,
    );
    setShowEmailVerificationModal(false);
    setShowRegisterModal(false);
    setShowLoginModal(true);
    console.log("=== LOGIN MODAL SHOULD NOW BE TRUE ===");
  };

  const handleRegisterClick = () => {
    console.log("=== GET STARTED BUTTON CLICKED ===");
    console.log(
      "Current state - Login:",
      showLoginModal,
      "Register:",
      showRegisterModal,
      "Email:",
      showEmailVerificationModal,
    );
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowEmailVerificationModal(true);
    console.log("=== EMAIL VERIFICATION MODAL SHOULD NOW BE TRUE ===");
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowEmailVerificationModal(false);
    clearEmailVerification();
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowEmailVerificationModal(true);
  };

  const handleRegister = async (data: {
    name?: string;
    institutionName?: string;
    email: string;
    accountType: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    setIsRegistering(true);
    try {
      await register(
        {
          fullName: data.name,
          institutionName: data.institutionName,
          email: data.email,
          accountType: data.accountType as
            | "Individual User"
            | "Bank/Institution",
          password: data.password,
          confirmPassword: data.password,
          phone: data.phone,
          address: data.address,
        },
        (user) => {
          showToast({
            type: "success",
            title: "Account Created Successfully!",
            message: `Welcome to KYCChain, ${user.name}! You're now logged in.`,
          });
          setShowRegisterModal(false);
          clearEmailVerification();
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.";
      showToast({
        type: "error",
        title: "Registration Failed",
        message: errorMessage,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <Hero onGetStarted={handleGetStarted} onLearnMore={scrollToFeatures} />
      <Features />
      <Workflow />
      <Contact />
      <Footer />

      <AnimatePresence mode="wait">
        {showEmailVerificationModal && (
          <EmailVerificationModal
            key="email-verification"
            isOpen={showEmailVerificationModal}
            onClose={() => {
              console.log("Closing Email Verification Modal");
              setShowEmailVerificationModal(false);
            }}
            onVerificationSuccess={handleEmailVerificationSuccess}
          />
        )}

        {showLoginModal && (
          <LoginModal
            key="login"
            isOpen={showLoginModal}
            onClose={() => {
              console.log("Closing Login Modal");
              setShowLoginModal(false);
            }}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}

        {showRegisterModal && (
          <RegisterModal
            key="register"
            isOpen={showRegisterModal}
            onClose={() => {
              console.log("Closing Register Modal");
              setShowRegisterModal(false);
              clearEmailVerification();
            }}
            onSwitchToLogin={handleSwitchToLogin}
            onRegister={handleRegister}
            loading={isRegistering}
            prefilledEmail={verifiedEmail}
          />
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce-slow chat-button-pulse"
          aria-label="Open chat support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Live Chat Widget */}
      <LiveChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </motion.div>
  );
};

const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <UserDashboard />;
      case "documents":
        return <DocumentsPage />;
      case "consent":
        return <ConsentPage />;
      case "fraud-alerts":
        return <FraudAlertsPage />;
      case "profile":
        return <ProfilePage />;
      case "verification":
        return <BankVerificationPage />;
      case "verification-logs":
        return <VerificationLogsPage />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <motion.div
      className="flex min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setSidebarOpen(false); // Close sidebar on mobile after navigation
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <motion.main
        className="flex-1 md:ml-64 p-4 md:p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            className="animate-spin-enhanced rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.p
            className="text-white animate-pulse"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Loading KYCChain...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? <DashboardLayout /> : <LandingPage />}
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
