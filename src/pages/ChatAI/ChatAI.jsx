import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  HiPaperAirplane,
  HiSparkles,
  HiUser,
  HiChatAlt2,
  HiHome,
  HiX,
  HiMenu,
  HiLightningBolt,
} from "react-icons/hi";

const ChatAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hello! I'm your AI assistant. Ask me anything about Irvan Nasyakban's portfolio, skills, or projects!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Call API
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.post(`${apiUrl}/api/chatbot/chat`, {
        message: currentMessage,
        conversationHistory: conversationHistory,
      });

      if (response.data.success) {
        // Update conversation history
        const newHistory = [
          ...conversationHistory,
          { role: "user", content: currentMessage },
          { role: "assistant", content: response.data.message },
        ];
        setConversationHistory(newHistory);

        // Add AI response
        const aiMessage = {
          id: messages.length + 2,
          type: "ai",
          content: response.data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        type: "ai",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Auto-submit after setting the message
    setTimeout(() => {
      const submitBtn = document.getElementById('chat-submit-btn');
      if (submitBtn) submitBtn.click();
    }, 100);
  };

  const quickQuestions = [
    "What are Irvan's skills?",
    "Show me his projects",
    "Tell me about his experience",
    "What technologies does he use?",
  ];

  return (
    <div className="min-h-screen bg-[#282C33] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={`top-left-${i}`} className="w-1 h-1 bg-purple-500"></div>
          ))}
        </div>
        <div className="absolute bottom-20 right-20 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={`bottom-right-${i}`} className="w-1 h-1 bg-purple-500"></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-slate-600 opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-purple-500 opacity-40"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-slate-700 bg-[#282C33]/95 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-slate-300 hover:text-purple-500 transition-colors"
              >
                {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <HiSparkles className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    AI Assistant
                  </h1>
                  <p className="text-xs text-slate-400">Ask anything about Irvan</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
            >
              <HiHome />
              <span className="hidden md:inline">Back to Home</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Sidebar - Quick Actions */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 border-r border-slate-700 bg-[#282C33]/95 backdrop-blur-md p-6 overflow-y-auto absolute lg:relative h-full z-20"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <HiLightningBolt className="text-purple-500" />
                    Quick Questions
                  </h2>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleQuickQuestion(question)}
                        className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-300 text-sm border border-slate-600 hover:border-purple-500"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">About This AI</h3>
                  <div className="space-y-3 text-xs text-slate-400">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                      <p>Powered by DeepSeek AI</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                      <p>Trained on Irvan's portfolio data</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                      <p>Real-time responses</p>
                    </div>
                  </div>
                </div>

                <div className="border border-purple-500/30 bg-purple-500/10 rounded-lg p-4">
                  <p className="text-xs text-purple-300">
                    💡 Tip: Ask specific questions about projects, skills, or experience for better results!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      message.type === "ai"
                        ? "bg-purple-600"
                        : "bg-slate-700"
                    }`}
                  >
                    {message.type === "ai" ? (
                      <HiSparkles className="text-white text-lg" />
                    ) : (
                      <HiUser className="text-white text-lg" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`max-w-[70%] ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === "ai"
                          ? "bg-slate-700 text-slate-200 rounded-tl-sm"
                          : "bg-purple-600 text-white rounded-tr-sm"
                      }`}
                    >
                      {message.type === "ai" ? (
                        <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              // Style for paragraphs
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              // Style for bold text
                              strong: ({ children }) => (
                                <strong className="font-bold text-purple-300">{children}</strong>
                              ),
                              // Style for italic text
                              em: ({ children }) => (
                                <em className="italic text-slate-300">{children}</em>
                              ),
                              // Style for ordered lists
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                              ),
                              // Style for unordered lists
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                              ),
                              // Style for list items
                              li: ({ children }) => (
                                <li className="ml-2">{children}</li>
                              ),
                              // Style for code blocks
                              code: ({ inline, children }) =>
                                inline ? (
                                  <code className="bg-slate-600 px-1.5 py-0.5 rounded text-purple-300">
                                    {children}
                                  </code>
                                ) : (
                                  <code className="block bg-slate-600 p-2 rounded my-2 overflow-x-auto">
                                    {children}
                                  </code>
                                ),
                              // Style for headings
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2 text-purple-300">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold mb-2 text-purple-300">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold mb-1 text-purple-300">{children}</h3>
                              ),
                              // Style for blockquotes
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-purple-500 pl-3 my-2 italic text-slate-300">
                                  {children}
                                </blockquote>
                              ),
                              // Style for links
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 underline"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <HiSparkles className="text-white text-lg" />
                  </div>
                  <div className="bg-slate-700 px-6 py-4 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1.5">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 bg-[#282C33]/95 backdrop-blur-md p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="relative">
                <div className="relative flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about Irvan..."
                      className="w-full bg-slate-700 border border-slate-600 focus:border-purple-500 text-white px-6 py-4 pr-14 rounded-xl outline-none transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <HiChatAlt2 className="text-xl" />
                    </div>
                  </div>
                  <motion.button
                    id="chat-submit-btn"
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <HiPaperAirplane className="text-xl" />
                  </motion.button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
                  <p>Press Enter to send</p>
                  <p className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></span>
                    {isTyping ? 'AI is typing...' : 'AI is ready'}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
        />
      )}
    </div>
  );
};

export default ChatAI;