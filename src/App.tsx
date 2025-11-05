import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/landing/Header';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Workflow from './components/landing/Workflow';
import Footer from './components/landing/Footer';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Sidebar from './components/layout/Sidebar';
import UserDashboard from './components/dashboard/UserDashboard';
import DocumentsPage from './pages/user/DocumentsPage';
import ConsentPage from './pages/user/ConsentPage';
import FraudAlertsPage from './pages/user/FraudAlertsPage';
import ProfilePage from './pages/user/ProfilePage';
import BankVerificationPage from './pages/user/BankVerificationPage';
import VerificationLogsPage from './pages/user/VerificationLogsPage';

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
      />
      <Hero 
        onGetStarted={() => setShowRegisterModal(true)}
        onLearnMore={scrollToFeatures}
      />
      <Features />
      <Workflow />
      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <UserDashboard />;
      case 'documents':
        return <DocumentsPage />;
      case 'consent':
        return <ConsentPage />;
      case 'fraud-alerts':
        return <FraudAlertsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'verification':
        return <BankVerificationPage />;
      case 'verification-logs':
        return <VerificationLogsPage />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 ml-64 p-8">
        {renderPage()}
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <DashboardLayout /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;