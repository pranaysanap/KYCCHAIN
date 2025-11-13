import React, { useState, useEffect } from 'react';
import { Upload, Hash, UserCheck, Building, Brain, ArrowRight, CheckCircle, Clock, Zap } from 'lucide-react';
import { useStaggeredAnimation } from '../../hooks/useScrollAnimation';

const Workflow: React.FC = () => {
  const { containerRef, visibleItems } = useStaggeredAnimation(5, 150);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload',
      description: 'User uploads KYC documents securely',
      color: 'blue',
      details: 'Secure file upload with instant encryption and validation',
      duration: '30s'
    },
    {
      icon: <Hash className="w-8 h-8" />,
      title: 'Hash on Blockchain',
      description: 'Document hash stored immutably',
      color: 'green',
      details: 'SHA-256 hashing ensures document integrity forever',
      duration: '15s'
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: 'Consent',
      description: 'User grants bank access permission',
      color: 'yellow',
      details: 'Smart contract-based consent with revocable permissions',
      duration: '1min'
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Bank Verification',
      description: 'Bank reviews and verifies documents',
      color: 'red',
      details: 'Human-AI hybrid verification with compliance checks',
      duration: '2-5min'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Fraud Check',
      description: 'Real-time fraud detection analysis',
      color: 'purple',
      details: 'Advanced ML models detect forgery and anomalies',
      duration: '10s'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-400 shadow-blue-400/20',
    green: 'text-green-400 bg-green-500/20 border-green-400 shadow-green-400/20',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-400 shadow-yellow-400/20',
    red: 'text-red-400 bg-red-500/20 border-red-400 shadow-red-400/20',
    purple: 'text-purple-400 bg-purple-500/20 border-purple-400 shadow-purple-400/20'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const handleStepClick = (index: number) => {
    setIsAnimating(true);
    setActiveStep(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section id="workflow" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Seamless
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Workflow</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our streamlined 5-step process ensures secure, efficient, and fraud-resistant KYC verification.
          </p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative mb-16">
          {/* Progress Bar */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex flex-col items-center cursor-pointer transition-all duration-500 ${
                    index <= activeStep ? 'scale-110' : 'scale-100'
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className={`relative w-20 h-20 rounded-full border-3 ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 shadow-lg transition-all duration-500 ${
                    index === activeStep ? 'shadow-2xl scale-125 animate-pulse' : ''
                  }`}>
                    {index < activeStep ? (
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    ) : index === activeStep ? (
                      <div className="relative">
                        {step.icon}
                        <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75"></div>
                      </div>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className={`font-bold mb-2 transition-colors ${
                      index <= activeStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm max-w-40 transition-colors ${
                      index <= activeStep ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                    <div className={`flex items-center justify-center mt-2 text-xs transition-colors ${
                      index <= activeStep ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {step.duration}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 mx-4 relative">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-1000 ${
                      index < activeStep ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    {index === activeStep - 1 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 animate-pulse"></div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  index === activeStep ? 'glassmorphism-ultra scale-105' : 'glassmorphism'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className={`relative w-14 h-14 rounded-full border-2 ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  index === activeStep ? 'shadow-2xl scale-110 animate-pulse' : ''
                }`}>
                  {index < activeStep ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : index === activeStep ? (
                    <div className="relative">
                      {step.icon}
                      <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75"></div>
                    </div>
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 transition-colors ${
                    index <= activeStep ? 'text-white' : 'text-gray-400'
                  }`}>
                    {index + 1}. {step.title}
                  </h3>
                  <p className={`text-sm mb-2 transition-colors ${
                    index <= activeStep ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                  <div className={`flex items-center text-xs transition-colors ${
                    index <= activeStep ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {step.duration}
                  </div>
                </div>
                {index === activeStep && (
                  <ArrowRight className="w-5 h-5 text-blue-400 animate-bounce" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        <div className={`glassmorphism-ultra rounded-2xl p-8 mb-16 transition-all duration-500 ${
          isAnimating ? 'scale-105' : 'scale-100'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full border-3 ${colorClasses[steps[activeStep].color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg`}>
                {steps[activeStep].icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{steps[activeStep].title}</h3>
                <p className="text-gray-300">{steps[activeStep].description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{steps[activeStep].duration}</span>
            </div>
          </div>
          <p className="text-lg text-gray-200 leading-relaxed">
            {steps[activeStep].details}
          </p>
          <div className="flex items-center mt-4">
            <Zap className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">Powered by advanced blockchain technology</span>
          </div>
        </div>

        {/* Process Flow Details */}
        <div ref={containerRef} className="mt-16 glassmorphism rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Process Flow Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`space-y-4 transition-all duration-500 ${
              visibleItems.has(0) ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: visibleItems.has(0) ? '0ms' : '0ms' }}>
              <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Upload className="w-4 h-4 text-blue-400" />
                </div>
                Security Features
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>End-to-end encryption with AES-256</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Immutable blockchain records on Ethereum</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Zero-knowledge proofs for privacy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Decentralized architecture with IPFS</span>
                </li>
              </ul>
            </div>
            <div className={`space-y-4 transition-all duration-500 ${
              visibleItems.has(1) ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: visibleItems.has(1) ? '200ms' : '0ms' }}>
              <h4 className="text-lg font-semibold text-green-400 flex items-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-green-400" />
                </div>
                AI Capabilities
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Advanced document forgery detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Facial recognition with 99.5% accuracy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Duplicate submission prevention</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Real-time anomaly scoring system</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className={`mt-12 pt-8 border-t border-gray-700 transition-all duration-500 ${
            visibleItems.has(2) ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: visibleItems.has(2) ? '400ms' : '0ms' }}>
            <h4 className="text-xl font-bold text-white mb-6 text-center">Performance Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">30s</div>
                <div className="text-sm text-gray-400">Average Upload Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Detection Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">2-5min</div>
                <div className="text-sm text-gray-400">Verification Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400">System Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;