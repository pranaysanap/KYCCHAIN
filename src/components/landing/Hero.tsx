import React from "react";
import {
  Shield,
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Star,
  Lock,
} from "lucide-react";
import Button from "../common/Button";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onLearnMore }) => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation({
    threshold: 0.1,
    delay: 200,
  });

  // Animated counters for stats
  const fraudDetectionCount = useAnimatedCounter({
    end: 99.9,
    duration: 2500,
    decimals: 1,
  });
  const blockchainIntegrityCount = useAnimatedCounter({
    end: 100,
    duration: 2000,
  });
  const verificationTimeCount = useAnimatedCounter({
    end: 2,
    duration: 2000,
  });
  const userSatisfactionCount = useAnimatedCounter({
    end: 98,
    duration: 2300,
  });

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24"
    >
      {/* Simple Animated Background Gradient */}
      <div className="absolute inset-0 gradient-bg-animated opacity-70"></div>

      {/* Floating Orbs - Simple and Smooth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Blue Orb */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full floating-orb opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)",
            filter: "blur(40px)",
          }}
        ></div>

        {/* Medium Purple Orb */}
        <div
          className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full floating-orb-delayed opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)",
            filter: "blur(40px)",
            animationDelay: "-10s",
          }}
        ></div>

        {/* Small Pink Orb */}
        <div
          className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full floating-orb opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent)",
            filter: "blur(30px)",
            animationDelay: "-15s",
          }}
        ></div>

        {/* Small Green Orb */}
        <div
          className="absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full floating-orb-delayed opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent)",
            filter: "blur(30px)",
            animationDelay: "-20s",
          }}
        ></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Shield Icon */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              heroVisible ? "scale-in" : "opacity-0 scale-95"
            }`}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 glassmorphism rounded-full gentle-glow group cursor-pointer smooth-transition hover:scale-110">
              <Shield className="w-10 h-10 md:w-12 md:h-12 text-blue-400 drop-shadow-lg smooth-transition group-hover:rotate-12" />
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${
              heroVisible ? "fade-in-up" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block text-white/90 mb-2 font-light">
              Secure AI-Powered
            </span>
            <span className="block gradient-text-animated font-black">
              KYC on Blockchain
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
              heroVisible ? "fade-in-up" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="font-semibold text-blue-300">
              Fraud-proof verification
            </span>{" "}
            for financial institutions.
            <br className="hidden sm:block" />
            <span className="text-green-300 font-medium">
              Blockchain integrity
            </span>{" "}
            meets{" "}
            <span className="text-purple-300 font-medium">
              AI-powered fraud detection
            </span>
            .
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-300 ${
              heroVisible ? "scale-in" : "opacity-0 scale-95"
            }`}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto button-smooth focus-ring px-8 py-4 shadow-lg hover:shadow-xl smooth-transition hover:scale-105"
            >
              <span className="relative z-10 font-semibold">Get Started</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onLearnMore}
              icon={<Play className="w-5 h-5" />}
              className="w-full sm:w-auto button-smooth focus-ring border-2 border-blue-400/50 hover:border-blue-400 px-8 py-4 smooth-transition hover:scale-105"
            >
              <span className="relative z-10 font-semibold">Learn More</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-500 ${
              heroVisible ? "fade-in-up" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Fraud Detection Rate */}
            <div className="glassmorphism rounded-2xl p-6 card-hover group cursor-pointer smooth-transition">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-green-400 smooth-transition group-hover:scale-110" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 smooth-transition group-hover:scale-105">
                {fraudDetectionCount}%
              </div>
              <div className="text-gray-300 text-sm font-medium mb-3">
                Fraud Detection Rate
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full smooth-transition"
                  style={{
                    width: `${fraudDetectionCount}%`,
                    background: "linear-gradient(90deg, #10b981, #34d399)",
                  }}
                ></div>
              </div>
            </div>

            {/* Blockchain Integrity */}
            <div className="glassmorphism rounded-2xl p-6 card-hover group cursor-pointer smooth-transition">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-blue-400 smooth-transition group-hover:scale-110" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 smooth-transition group-hover:scale-105">
                {blockchainIntegrityCount}%
              </div>
              <div className="text-gray-300 text-sm font-medium mb-3">
                Blockchain Integrity
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full smooth-transition"
                  style={{
                    width: `${blockchainIntegrityCount}%`,
                    background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                  }}
                ></div>
              </div>
            </div>

            {/* Verification Time */}
            <div className="glassmorphism rounded-2xl p-6 card-hover group cursor-pointer smooth-transition">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-yellow-400 smooth-transition group-hover:scale-110" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 smooth-transition group-hover:scale-105">
                {verificationTimeCount}sec
              </div>
              <div className="text-gray-300 text-sm font-medium mb-3">
                Verification Time
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full smooth-transition"
                  style={{
                    width: `${Math.max(10, (10 - verificationTimeCount) * 10)}%`,
                    background: "linear-gradient(90deg, #fbbf24, #fcd34d)",
                  }}
                ></div>
              </div>
            </div>

            {/* User Satisfaction */}
            <div className="glassmorphism rounded-2xl p-6 card-hover group cursor-pointer smooth-transition">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-purple-400 smooth-transition group-hover:scale-110" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 smooth-transition group-hover:scale-105">
                {userSatisfactionCount}%
              </div>
              <div className="text-gray-300 text-sm font-medium mb-3">
                User Satisfaction
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full smooth-transition"
                  style={{
                    width: `${userSatisfactionCount}%`,
                    background: "linear-gradient(90deg, #a855f7, #c084fc)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div
            className={`mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm transition-all duration-1000 delay-700 ${
              heroVisible ? "fade-in" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 smooth-transition hover:text-white">
              <Lock className="w-4 h-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 smooth-transition hover:text-white">
              <Shield className="w-4 h-4" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2 smooth-transition hover:text-white">
              <CheckCircle className="w-4 h-4" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade Effect */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(13, 17, 23, 1), transparent)",
        }}
      ></div>
    </section>
  );
};

export default Hero;
