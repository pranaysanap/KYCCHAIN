import React from 'react';
import { Upload, Hash, UserCheck, Building, Brain } from 'lucide-react';

const Workflow: React.FC = () => {
  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload',
      description: 'User uploads KYC documents securely',
      color: 'blue'
    },
    {
      icon: <Hash className="w-6 h-6" />,
      title: 'Hash on Blockchain',
      description: 'Document hash stored immutably',
      color: 'green'
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Consent',
      description: 'User grants bank access permission',
      color: 'yellow'
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: 'Bank Verification',
      description: 'Bank reviews and verifies documents',
      color: 'red'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Fraud Check',
      description: 'Real-time fraud detection analysis',
      color: 'blue'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-400',
    green: 'text-green-400 bg-green-500/20 border-green-400',
    yellow: 'text-yellow-400 bg-yellow-500/20 border-yellow-400',
    red: 'text-red-400 bg-red-500/20 border-red-400'
  };

  return (
    <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
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

        {/* Desktop Timeline */}
        <div className="hidden lg:flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full border-2 ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-300 max-w-32">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full border-2 ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center flex-shrink-0`}>
                {step.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Process Flow Details */}
        <div className="mt-16 glassmorphism rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Process Flow Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-400">Security Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• End-to-end encryption</li>
                <li>• Immutable blockchain records</li>
                <li>• Zero-knowledge proofs</li>
                <li>• Decentralized architecture</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400">AI Capabilities</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Document forgery detection</li>
                <li>• Facial recognition matching</li>
                <li>• Duplicate submission prevention</li>
                <li>• Real-time anomaly scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;