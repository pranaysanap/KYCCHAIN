import React, { useState } from "react";
import { Hash, UserCheck, Brain, Shield, Sparkles, Zap } from "lucide-react";
import { useStaggeredAnimation } from "../../hooks/useScrollAnimation";

const Features: React.FC = () => {
  const { containerRef, visibleItems } = useStaggeredAnimation(4, 150);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: <Hash className="w-8 h-8" />,
      title: "Document Hashing & Blockchain Integrity",
      description:
        "Every document is hashed using SHA-256 and stored on the blockchain, ensuring immutable proof of authenticity and preventing tampering.",
      color: "blue",
      bgPattern:
        "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1), transparent 50%)",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Consent Management via Smart Contracts",
      description:
        "User consent is managed through smart contracts, giving users full control over who can access their verification data.",
      color: "green",
      bgPattern:
        "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1), transparent 50%)",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Fraud Detection in Real-Time",
      description:
        "Advanced machine learning algorithms detect document forgery, face mismatches, and duplicate submissions instantly.",
      color: "red",
      bgPattern:
        "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.1), transparent 50%)",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "End-to-End Security",
      description:
        "Military-grade encryption, zero-knowledge proofs, and decentralized architecture ensure maximum security and privacy.",
      color: "yellow",
      bgPattern:
        "radial-gradient(circle at 80% 80%, rgba(234, 179, 8, 0.1), transparent 50%)",
    },
  ];

  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/20 neon-glow-blue",
    green: "text-green-400 bg-green-500/20 neon-glow-green",
    red: "text-red-400 bg-red-500/20 neon-glow-red",
    yellow: "text-yellow-400 bg-yellow-500/20 neon-glow-yellow",
  };

  return (
    <section
      id="features"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionary KYC
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {" "}
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Combining the power of blockchain technology with cutting-edge AI to
            create the most secure and efficient KYC solution.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative glassmorphism-ultra rounded-2xl p-8 overflow-hidden transition-all duration-500 group cursor-pointer will-change-transform ${
                visibleItems.has(index)
                  ? "animate-fade-in-up morphing-card"
                  : "opacity-0 translate-y-8"
              } ${hoveredIndex === index ? "scale-105 shadow-2xl" : "hover:scale-102"}`}
              style={{
                transitionDelay: visibleItems.has(index)
                  ? `${index * 150}ms`
                  : "0ms",
                animationDelay: visibleItems.has(index)
                  ? `${index * 150}ms`
                  : "0ms",
                background:
                  hoveredIndex === index
                    ? feature.bgPattern
                    : "rgba(255, 255, 255, 0.05)",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated background pattern */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: feature.bgPattern }}
              ></div>

              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>

              {/* Animated icon with ripple effect */}
              <div className="relative mb-6">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                >
                  <div className="relative">
                    {feature.icon}
                    {/* Ripple rings */}
                    <div className="absolute inset-0 rounded-xl border-2 border-current opacity-0 group-hover:opacity-30 group-hover:animate-ping"></div>
                    <div className="absolute inset-0 rounded-xl border border-current opacity-0 group-hover:opacity-20 group-hover:animate-ping animation-delay-300"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>

              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animation-delay-200">
                <Zap className="w-3 h-3 text-blue-400 animate-bounce" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
