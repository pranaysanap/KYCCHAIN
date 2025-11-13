import React from "react";
import { Shield, ArrowRight, Play, CheckCircle, Zap, Star } from "lucide-react";
import Button from "../common/Button";

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onLearnMore }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 md:pt-24"
    >
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Simple Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Simple Typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            <span className="block mb-2">Secure AI-Powered</span>
            <span className="gradient-text-animated">KYC on Blockchain</span>
          </h1>

          {/* Simple Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Fraud-proof verification for financial institutions. Blockchain integrity meets AI-powered fraud detection.
          </p>

          {/* Simple CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto btn-hover px-8 py-4"
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onLearnMore}
              icon={<Play className="w-5 h-5" />}
              className="w-full sm:w-auto btn-hover border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 px-8 py-4"
            >
              Learn More
            </Button>
          </div>

          {/* Simple Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text-animated mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Fraud Detection Rate
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text-animated mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Blockchain Integrity
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text-animated mb-2">2sec</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Verification Time
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift">
              <div className="text-3xl font-bold gradient-text-animated mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-purple-500" />
                User Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
