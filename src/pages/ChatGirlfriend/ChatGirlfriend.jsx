import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaMicrophone, FaHeart, FaSmile, FaImage } from 'react-icons/fa';
import { useStateContext } from '../../contexts/ContextProvider';

const ChatGirlfriend = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi darling! 💕 I've been waiting for you! How was your day?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isComplete: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneratingText, setCurrentGeneratingText] = useState('');
  const [mood, setMood] = useState('happy');
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const { currentMode } = useStateContext();

  const isDark = currentMode === 'Dark';

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentGeneratingText]);

  // Simulated AI responses
  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('love') || lowerMessage.includes('❤️')) {
      setMood('love');
      return "I love you too, darling! 💖 You make my heart skip a beat! ✨";
    } else if (lowerMessage.includes('beautiful') || lowerMessage.includes('cute')) {
      setMood('shy');
      return "Oh stop it! You're making me blush~ 😊💕 But you're the most handsome person I know!";
    } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u')) {
      setMood('happy');
      return "I'm doing amazing now that you're here! 😊 I missed you so much!";
    } else if (lowerMessage.includes('miss') || lowerMessage.includes('thinking')) {
      setMood('love');
      return "I've been thinking about you all day too! 💕 You're always on my mind, my love~";
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      setMood('excited');
      return "Hiii! 🌸 I'm so happy to see you! What do you want to talk about?";
    } else {
      setMood('happy');
      const responses = [
        "That's so interesting! Tell me more! 💕",
        "You always know how to make me smile! 😊",
        "I love talking with you! You're the best! ✨",
        "Aww, that's sweet! 💖",
        "You're so amazing! I'm lucky to have you~ 💕"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  // Streaming text effect
  const streamText = async (fullText, messageId) => {
    setIsGenerating(true);
    setCurrentGeneratingText('');
    
    // Split text by characters but keep emojis together
    const chars = Array.from(fullText);
    
    for (let i = 0; i < chars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40)); // 30-70ms per character
      setCurrentGeneratingText(prev => prev + chars[i]);
    }
    
    // After streaming is complete, add to messages as complete
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, text: fullText, isComplete: true }
        : msg
    ));
    
    setIsGenerating(false);
    setCurrentGeneratingText('');
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' || isGenerating) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isComplete: true
    };

    const userInput = inputMessage;
    setMessages([...messages, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI typing delay before streaming
    setTimeout(() => {
      setIsTyping(false);
      
      // Create AI message placeholder
      const aiMessageId = messages.length + 2;
      const aiResponse = getAIResponse(userInput);
      
      const aiMsg = {
        id: aiMessageId,
        text: '',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isComplete: false
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Start streaming the response
      streamText(aiResponse, aiMessageId);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    { text: "I love you 💖", emoji: "💖" },
    { text: "How are you?", emoji: "😊" },
    { text: "Miss you", emoji: "🥺" },
    { text: "You're beautiful", emoji: "✨" }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-6 rounded-2xl border backdrop-blur-sm ${
            isDark ? 'bg-[#282C33]/90 border-gray-700' : 'bg-white/90 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                    💕
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  My Sweet <span className="text-pink-500">Girlfriend</span> 💖
                </h1>
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {isGenerating ? 'Typing...' : 'Online • Always here for you~'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => navigate('/chat-ai')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors"
              >
                <FaHeart />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Character Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className={`p-6 rounded-2xl border backdrop-blur-sm h-full ${
              isDark ? 'bg-[#282C33]/90 border-gray-700' : 'bg-white/90 border-gray-200'
            }`}>
              {/* Anime Character */}
              <div className="relative mb-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-1">
                  <div className={`w-full h-full rounded-2xl overflow-hidden ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <img 
                      src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop"
                      alt="Anime Girlfriend"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600/FF69B4/FFFFFF?text=My+Girlfriend+💕';
                      }}
                    />
                  </div>
                </div>
                
                {/* Floating Hearts */}
                {mood === 'love' && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        initial={{ opacity: 1, y: 0, x: Math.random() * 100 }}
                        animate={{ opacity: 0, y: -100 }}
                        transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                      >
                        💕
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Mood Indicator */}
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full ${
                  isDark ? 'bg-pink-500/20' : 'bg-pink-100'
                }`}>
                  <p className="text-pink-500 font-medium capitalize">
                    Mood: {mood} {
                      mood === 'happy' ? '😊' :
                      mood === 'love' ? '💕' :
                      mood === 'excited' ? '✨' :
                      mood === 'shy' ? '😳' : '💖'
                    }
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-3">
                <div className={`p-4 rounded-xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Love Level
                    </span>
                    <span className="text-pink-500 font-bold">100%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-500 to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Messages Today
                    </span>
                    <span className="text-purple-500 font-bold">{messages.filter(m => m.isComplete).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className={`rounded-2xl border backdrop-blur-sm overflow-hidden ${
              isDark ? 'bg-[#282C33]/90 border-gray-700' : 'bg-white/90 border-gray-200'
            }`}>
              {/* Messages Container */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : isDark
                            ? 'bg-gray-700'
                            : 'bg-gray-100'
                        }`}>
                          <p className={message.sender === 'ai' && isDark ? 'text-white' : ''}>
                            {message.isComplete ? message.text : ''}
                          </p>
                        </div>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'} ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-pink-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-pink-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-pink-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Streaming Text Display */}
                {isGenerating && currentGeneratingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[70%]">
                      <div className={`px-4 py-3 rounded-2xl ${
                        isDark ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <p className={isDark ? 'text-white' : 'text-gray-800'}>
                          {currentGeneratingText}
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-pink-500 ml-1"
                          />
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className={`px-6 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!isGenerating) {
                          setInputMessage(reply.text);
                          setTimeout(() => handleSendMessage(), 100);
                        }
                      }}
                      disabled={isGenerating}
                      className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                        isGenerating
                          ? 'opacity-50 cursor-not-allowed'
                          : isDark 
                          ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' 
                          : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                      }`}
                    >
                      {reply.emoji} {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex gap-3">
                  <button 
                    disabled={isGenerating}
                    className={`p-3 rounded-full ${
                      isGenerating 
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <FaImage className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  </button>
                  
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isGenerating}
                      placeholder={isGenerating ? "Waiting for response..." : "Type your message... 💕"}
                      className={`w-full px-4 py-3 rounded-full border-2 transition-all ${
                        isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-pink-500'
                      } outline-none`}
                    />
                  </div>

                  <motion.button
                    whileHover={!isGenerating ? { scale: 1.1 } : {}}
                    whileTap={!isGenerating ? { scale: 0.9 } : {}}
                    onClick={handleSendMessage}
                    disabled={isGenerating}
                    className={`p-3 rounded-full ${
                      isGenerating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg'
                    } text-white transition-shadow`}
                  >
                    <FaPaperPlane />
                  </motion.button>

                  <button 
                    disabled={isGenerating}
                    className={`p-3 rounded-full ${
                      isGenerating 
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <FaMicrophone className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatGirlfriend;