import React from 'react';
import { Shield, Menu, X } from 'lucide-react';
import Button from '../common/Button';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">KYCChain</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('workflow')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Demo Workflow
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={onLoginClick}>
              Login
            </Button>
            <Button variant="primary" onClick={onRegisterClick}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-lg mt-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('workflow')}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Demo Workflow
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left"
              >
                Contact
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" onClick={onLoginClick} size="sm">
                  Login
                </Button>
                <Button variant="primary" onClick={onRegisterClick} size="sm">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;