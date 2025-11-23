import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useStaggeredAnimation } from '../../hooks/useScrollAnimation';

const Testimonials: React.FC = () => {
  const { containerRef, visibleItems } = useStaggeredAnimation(3, 200);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Compliance Officer',
      company: 'Global Finance Corp',
      content: 'KYCChain has revolutionized our KYC process. The AI fraud detection is incredible, catching issues that our manual reviewers missed. The blockchain integration gives us complete confidence in data integrity.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Risk Management',
      company: 'TechBank Solutions',
      content: 'Implementation was seamless. Our verification time dropped from days to seconds, and the smart contract-based consent management gives our customers full control over their data.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Director',
      company: 'CryptoTrust Bank',
      content: 'The zero-knowledge proofs and end-to-end encryption make this the most secure KYC solution we\'ve ever used. Our customers love the transparency and control they have.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  return (
    <section id="testimonials" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what compliance officers and risk managers are saying about KYCChain's revolutionary approach to KYC verification.
          </p>
        </div>

        {/* Interactive Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Main testimonial display */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="glassmorphism-ultra rounded-2xl p-8 md:p-12 relative overflow-hidden group">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Floating particles */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animation-delay-300">
                      <Quote className="w-5 h-5 text-purple-400 animate-bounce" />
                    </div>

                    {/* Rating with animation */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-yellow-400 fill-current animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <blockquote className="text-center mb-8">
                      <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-6 font-light">
                        "{testimonial.content}"
                      </p>
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:text-purple-300 transition-colors" />
            </button>

            {/* Dots indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-purple-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:text-purple-300 transition-colors" />
            </button>

            {/* Play/Pause control */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group ml-4"
            >
              {isAutoPlaying ? (
                <Pause className="w-5 h-5 text-white group-hover:text-purple-300 transition-colors" />
              ) : (
                <Play className="w-5 h-5 text-white group-hover:text-purple-300 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Grid of all testimonials (visible on larger screens) */}
        <div ref={containerRef} className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glassmorphism rounded-xl p-6 hover:scale-105 transition-all duration-300 group relative overflow-hidden ${
                visibleItems.has(index) ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: visibleItems.has(index) ? `${index * 200}ms` : '0ms',
                animationDelay: visibleItems.has(index) ? `${index * 200}ms` : '0ms'
              }}
            >
              {/* Background gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-purple-400/30 group-hover:text-purple-400/50 transition-colors">
                <Quote className="w-6 h-6" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-white transition-colors text-sm">
                "{testimonial.content.substring(0, 120)}..."
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-3 group-hover:scale-110 transition-transform">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-400/30 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="glassmorphism rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Join Them?</h3>
            <p className="text-gray-300 mb-6">
              Join hundreds of financial institutions already using KYCChain to streamline their KYC processes.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                500+ Institutions
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                2M+ Verifications
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
