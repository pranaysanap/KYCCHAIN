import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import Button from "../common/Button";
import { useStaggeredAnimation } from "../../hooks/useScrollAnimation";
import LiveChatWidget from "../common/LiveChatWidget";

const Contact: React.FC = () => {
  const { containerRef, visibleItems } = useStaggeredAnimation(4, 150);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {" "}
              Touch
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to revolutionize your KYC process? Contact our team to learn
            more about KYCChain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className={`glassmorphism-ultra rounded-2xl p-8 transition-all duration-500 ${
              visibleItems.has(0)
                ? "animate-fade-in-up"
                : "opacity-0 translate-y-8"
            }`}
            style={{ animationDelay: visibleItems.has(0) ? "0ms" : "0ms" }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label
                    className={`block text-sm font-medium mb-2 transition-all duration-300 ${
                      focusedField === "firstName" || formData.firstName
                        ? "text-blue-400 transform -translate-y-1"
                        : "text-gray-300"
                    }`}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-gray-800/80 transition-all duration-300"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-sm font-medium mb-2 transition-all duration-300 ${
                      focusedField === "lastName" || formData.lastName
                        ? "text-blue-400 transform -translate-y-1"
                        : "text-gray-300"
                    }`}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-gray-800/80 transition-all duration-300"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  className={`block text-sm font-medium mb-2 transition-all duration-300 ${
                    focusedField === "email" || formData.email
                      ? "text-blue-400 transform -translate-y-1"
                      : "text-gray-300"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-gray-800/80 transition-all duration-300"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="relative">
                <label
                  className={`block text-sm font-medium mb-2 transition-all duration-300 ${
                    focusedField === "company" || formData.company
                      ? "text-blue-400 transform -translate-y-1"
                      : "text-gray-300"
                  }`}
                >
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-gray-800/80 transition-all duration-300"
                  placeholder="Your Company"
                />
              </div>

              <div className="relative">
                <label
                  className={`block text-sm font-medium mb-2 transition-all duration-300 ${
                    focusedField === "message" || formData.message
                      ? "text-blue-400 transform -translate-y-1"
                      : "text-gray-300"
                  }`}
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-gray-800/80 resize-none transition-all duration-300"
                  placeholder="Tell us about your KYC needs..."
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  icon={
                    isSubmitting ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                {submitStatus === "success" && (
                  <div className="flex items-center text-green-400 animate-fade-in">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Sent!</span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center text-red-400 animate-fade-in">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Error</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div ref={containerRef} className="space-y-8">
            <div
              className={`glassmorphism-ultra rounded-2xl p-8 transition-all duration-500 ${
                visibleItems.has(1)
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: visibleItems.has(1) ? "150ms" : "0ms" }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div
                  className="flex items-start space-x-4 group cursor-pointer"
                  onClick={() =>
                    (window.location.href = "mailto:contact@kycchain.com")
                  }
                >
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-all duration-300 group-hover:scale-110">
                    <Mail className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors duration-300">
                      Email
                    </h4>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      contact@kycchain.com
                    </p>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      support@kycchain.com
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-4 group cursor-pointer"
                  onClick={() => (window.location.href = "tel:+15551234567")}
                >
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30 transition-all duration-300 group-hover:scale-110">
                    <Phone className="w-6 h-6 text-green-400 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-green-400 transition-colors duration-300">
                      Phone
                    </h4>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      Mon-Fri 9AM-6PM EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-600/30 transition-all duration-300 group-hover:scale-110">
                    <MapPin className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-yellow-400 transition-colors duration-300">
                      Address
                    </h4>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      123 Blockchain Avenue
                    </p>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      Crypto City, CC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`glassmorphism-ultra rounded-2xl p-8 transition-all duration-500 ${
                visibleItems.has(2)
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: visibleItems.has(2) ? "300ms" : "0ms" }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Why Choose KYCChain?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-all duration-300"></div>
                  <p className="text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
                    99.9% fraud detection accuracy with AI
                  </p>
                </div>
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-all duration-300"></div>
                  <p className="text-gray-300 group-hover:text-green-300 transition-colors duration-300">
                    Lightning-fast 2-second verification
                  </p>
                </div>
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-all duration-300"></div>
                  <p className="text-gray-300 group-hover:text-yellow-300 transition-colors duration-300">
                    100% immutable blockchain records
                  </p>
                </div>
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-all duration-300"></div>
                  <p className="text-gray-300 group-hover:text-red-300 transition-colors duration-300">
                    GDPR compliant & privacy-first design
                  </p>
                </div>
              </div>
            </div>

            {/* Live Chat CTA */}
            <div
              className={`glassmorphism-ultra rounded-2xl p-8 transition-all duration-500 ${
                visibleItems.has(3)
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: visibleItems.has(3) ? "450ms" : "0ms" }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Need Immediate Help?
                </h4>
                <p className="text-gray-300 mb-6">
                  Start a live chat with our support team
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsChatOpen(true)}
                >
                  Start Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      <LiveChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </section>
  );
};

export default Contact;
