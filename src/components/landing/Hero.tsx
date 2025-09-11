import React from 'react';
import { Shield, ArrowRight, Play } from 'lucide-react';
import Button from '../common/Button';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onLearnMore }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl float-animation"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-xl float-animation" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500/20 rounded-full blur-xl float-animation" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/20 rounded-full pulse-glow">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow">
            Secure AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              KYC on Blockchain
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Fraud-proof, consent-driven verification for financial institutions.
            Leverage blockchain integrity and AI-powered fraud detection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onLearnMore}
              icon={<Play className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glassmorphism rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-300">Fraud Detection Rate</div>
            </div>
            <div className="glassmorphism rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-300">Blockchain Integrity</div>
            </div>
            <div className="glassmorphism rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">2sec</div>
              <div className="text-gray-300">Verification Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;