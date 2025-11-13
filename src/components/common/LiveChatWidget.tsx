import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 Welcome to KYCChain Support. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // AI Response Generator
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // KYC-related questions
    if (
      lowerMessage.includes("kyc") ||
      lowerMessage.includes("verification") ||
      lowerMessage.includes("verify")
    ) {
      return "KYCChain provides secure, blockchain-based KYC verification. You can upload documents like passports, ID cards, and driver's licenses. Our AI system verifies them in real-time with 99.9% accuracy. Would you like to know more about the verification process?";
    }

    if (
      lowerMessage.includes("document") ||
      lowerMessage.includes("upload") ||
      lowerMessage.includes("file")
    ) {
      return "You can upload documents in JPEG, PNG, or PDF format (max 10MB). After upload, we compute a SHA-256 hash and store it on the blockchain for immutable proof. The AI analyzes your document for authenticity within 2 seconds. Need help uploading?";
    }

    if (
      lowerMessage.includes("blockchain") ||
      lowerMessage.includes("secure")
    ) {
      return "All your documents are secured with 256-bit encryption and stored on the blockchain. We use SHA-256 hashing to create immutable records. Your data is completely safe and tamper-proof. We're also ISO 27001 certified and GDPR compliant. 🔒";
    }

    if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("pricing")
    ) {
      return "We offer flexible pricing plans for both individuals and institutions. Individual verification starts at $9.99/month, and enterprise plans are customized based on volume. Would you like me to connect you with our sales team?";
    }

    if (
      lowerMessage.includes("account") ||
      lowerMessage.includes("register") ||
      lowerMessage.includes("sign up")
    ) {
      return "Creating an account is easy! Just click 'Get Started' in the top-right corner. You'll verify your email, then complete the registration. The whole process takes less than 3 minutes. Shall I guide you through it?";
    }

    if (
      lowerMessage.includes("ai") ||
      lowerMessage.includes("fraud") ||
      lowerMessage.includes("detection")
    ) {
      return "Our AI fraud detection system uses advanced machine learning to detect document forgery, face mismatches, and duplicate submissions in real-time. It achieves 99.9% accuracy with false positive rates below 0.1%. Your documents are thoroughly analyzed for authenticity! 🤖";
    }

    if (
      lowerMessage.includes("time") ||
      lowerMessage.includes("long") ||
      lowerMessage.includes("fast")
    ) {
      return "Document verification takes just 2 seconds on average! Our AI processes your documents instantly. Blockchain confirmation happens within 10 seconds. You'll get immediate feedback on your verification status. ⚡";
    }

    if (
      lowerMessage.includes("bank") ||
      lowerMessage.includes("institution") ||
      lowerMessage.includes("business")
    ) {
      return "KYCChain is perfect for banks and financial institutions! We offer bulk verification, API integration, custom workflows, and enterprise-grade security. Over 500+ institutions trust us worldwide. Would you like a demo?";
    }

    if (
      lowerMessage.includes("support") ||
      lowerMessage.includes("contact") ||
      lowerMessage.includes("email")
    ) {
      return "You can reach our support team at support@kycchain.com or call us at +1-800-KYC-HELP. We're available 24/7 to help you! You can also use this chat anytime. 📧";
    }

    if (
      lowerMessage.includes("demo") ||
      lowerMessage.includes("try") ||
      lowerMessage.includes("test")
    ) {
      return "Great! We offer a free demo account. You can try our system with sample documents to see how it works. Would you like me to set up a demo account for you? It takes just 1 minute!";
    }

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return "Hello! 😊 I'm here to help you with anything related to KYCChain. Feel free to ask about our services, pricing, security, or how to get started!";
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! 🎉 Is there anything else I can help you with? I'm here 24/7 to answer your questions about KYCChain!";
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("?")) {
      return "I can help you with:\n\n📄 Document verification\n🔐 Security & blockchain\n💰 Pricing & plans\n🤖 AI fraud detection\n👤 Account registration\n🏦 Enterprise solutions\n\nWhat would you like to know more about?";
    }

    // Default response
    return "That's a great question! While I'm an AI assistant, I can help you with most KYCChain-related queries. Could you please provide more details, or would you like me to connect you with a human agent? You can also email us at support@kycchain.com for detailed assistance.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing and response delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateResponse(inputMessage),
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    ); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "How does KYC work?", icon: "❓" },
    { text: "Upload documents", icon: "📄" },
    { text: "Pricing plans", icon: "💰" },
    { text: "Talk to human", icon: "👤" },
  ];

  const handleQuickAction = (text: string) => {
    setInputMessage(text);
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-6 sm:left-auto z-[9999] flex justify-center sm:justify-end animate-fade-in-up">
      {/* Chat Window */}
      <div
        className={`rounded-2xl shadow-2xl border border-blue-500/30 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden ${
          isMinimized ? "h-16 w-full max-w-md sm:w-80" : "h-[600px] w-full max-w-md sm:w-96"
        } flex flex-col relative`
        }
        style={{
          // stronger, less transparent background for better readability
          backgroundImage: `linear-gradient(135deg, rgba(17,24,39,1) 0%, rgba(15,23,42,1) 100%)`,
          backgroundBlendMode: 'normal'
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-blue-400/30 rounded-t-2xl relative"
          style={{
            background:
              "linear-gradient(90deg, rgba(37, 99, 235, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(147, 51, 234, 0.4) 100%)",
            backgroundColor: "#1e293b",
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold">KYCChain Support</h3>
              <p className="text-xs text-green-400">● Online - AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-300 hover:text-white transition-colors p-1.5 rounded hover:bg-slate-700"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-1.5 rounded hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user"
                      ? "justify-end message-slide-in-right"
                      : "justify-start message-slide-in-left"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "bot"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gradient-to-r from-green-500 to-teal-500"
                      }`}
                    >
                      {message.sender === "bot" ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-lg ${
                          message.sender === "bot"
                            ? "text-white rounded-tl-none border border-slate-600"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-500/50"
                        }`}
                        style={
                          message.sender === "bot"
                            ? { backgroundColor: "#1e293b" }
                            : {}
                        }
                      >
                        <p className="text-sm whitespace-pre-line">
                          {message.text}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start message-slide-in-left">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div
                      className="px-4 py-2 rounded-2xl rounded-tl-none border border-slate-600 shadow-lg"
                      style={{ backgroundColor: "#1e293b" }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4 relative z-10">
                <p className="text-xs text-gray-300 mb-2 font-medium">
                  Quick actions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className="px-3 py-2 hover:bg-slate-600 text-white text-xs rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 border border-slate-600 shadow-md hover:shadow-lg hover:border-blue-400"
                      style={{ backgroundColor: "#1e293b" }}
                    >
                      <span>{action.icon}</span>
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div
              className="p-4 border-t border-blue-400/30 relative z-10"
              style={{ backgroundColor: "#0f172a" }}
            >
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all shadow-inner"
                  style={{ backgroundColor: "#1e293b" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Powered by AI • Available 24/7
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChatWidget;
