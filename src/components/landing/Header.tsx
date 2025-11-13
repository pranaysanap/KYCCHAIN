import React from "react";
import { Shield, Menu, X } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    alert("LOGIN BUTTON CLICKED!");
    console.log("Header: Login clicked");
    onLoginClick();
  };

  const handleRegisterClick = () => {
    alert("GET STARTED BUTTON CLICKED!");
    console.log("Header: Get Started clicked");
    onRegisterClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-gray-800/50 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">KYCChain</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["home", "features", "workflow", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                {section.charAt(0).toUpperCase() +
                  section.slice(1).replace("-", " ")}
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert("BUTTON ELEMENT CLICKED!");
                handleLoginClick();
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-all duration-200"
              style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 9999 }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert("GET STARTED CLICKED!");
                handleRegisterClick();
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transition-all duration-200"
              style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 9999 }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 rounded-lg mt-2 border border-gray-700/50 backdrop-blur-xl">
              {["home", "features", "workflow", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block px-3 py-2 text-gray-300 hover:text-white w-full text-left rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                >
                  {section.charAt(0).toUpperCase() +
                    section.slice(1).replace("-", " ")}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700/50">
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-all duration-200 w-full"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transition-all duration-200 w-full"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
