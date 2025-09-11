import React from 'react';
import { Hash, UserCheck, Brain, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Hash className="w-8 h-8" />,
      title: 'Document Hashing & Blockchain Integrity',
      description: 'Every document is hashed using SHA-256 and stored on the blockchain, ensuring immutable proof of authenticity and preventing tampering.',
      color: 'blue'
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: 'Consent Management via Smart Contracts',
      description: 'User consent is managed through smart contracts, giving users full control over who can access their verification data.',
      color: 'green'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Fraud Detection in Real-Time',
      description: 'Advanced machine learning algorithms detect document forgery, face mismatches, and duplicate submissions instantly.',
      color: 'red'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'End-to-End Security',
      description: 'Military-grade encryption, zero-knowledge proofs, and decentralized architecture ensure maximum security and privacy.',
      color: 'yellow'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20 neon-glow-blue',
    green: 'text-green-400 bg-green-500/20 neon-glow-green',
    red: 'text-red-400 bg-red-500/20 neon-glow-red',
    yellow: 'text-yellow-400 bg-yellow-500/20 neon-glow-yellow'
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionary KYC
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"> Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Combining the power of blockchain technology with cutting-edge AI to create the most secure and efficient KYC solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glassmorphism rounded-xl p-8 hover:scale-105 transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;