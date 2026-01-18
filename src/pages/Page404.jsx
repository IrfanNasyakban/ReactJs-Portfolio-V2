import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCode, FaExclamationTriangle } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';

const Page404 = () => {
  const navigate = useNavigate();
  const { currentColor, currentMode } = useStateContext();
  
  const safeColor = currentColor || '#A855F7';
  const isDark = currentMode === 'Dark';

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${
        isDark ? 'bg-[#1E2128]' : 'bg-gray-50'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={`top-left-${i}`} className="w-1 h-1" style={{ backgroundColor: safeColor }}></div>
          ))}
        </div>
        <div className="absolute bottom-20 right-20 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={`bottom-right-${i}`} className="w-1 h-1" style={{ backgroundColor: safeColor }}></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: safeColor }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content - 404 Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            {/* Error Badge */}
            <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: getColorWithOpacity(safeColor, 0.1) }}
              >
                <FaExclamationTriangle style={{ color: safeColor }} className="text-xl" />
              </div>
              <span 
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: safeColor }}
              >
                Error 404
              </span>
            </div>

            {/* Main Title */}
            <h1 className={`text-6xl md:text-7xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <span style={{ color: safeColor }}>404</span>
            </h1>
            
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Page Not Found
            </h2>

            {/* Description */}
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: safeColor }}
              >
                <FaHome />
                <span>Back to Home</span>
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-300 border-2 ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>Go Back</span>
              </button>
            </div>

            {/* Quote */}
            <div 
              className="mt-8 p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: getColorWithOpacity(safeColor, 0.05),
                borderColor: safeColor 
              }}
            >
              <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                "Not all those who wander are lost"
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                - J.R.R. Tolkien
              </p>
            </div>
          </motion.div>

          {/* Right Content - 404 Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center items-center"
          >
            <div className="relative">
              {/* Large 404 with effects */}
              <div className="relative">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-center"
                >
                  <div className="text-[12rem] md:text-[16rem] font-bold leading-none opacity-20" style={{ color: safeColor }}>
                    404
                  </div>
                </motion.div>

                {/* Floating Code Icons */}
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-10 -left-10 p-4 rounded-lg shadow-lg"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaCode className="text-white text-2xl" />
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className={`absolute bottom-10 -right-10 p-4 rounded-lg shadow-lg ${
                    isDark ? 'bg-gray-700' : 'bg-white'
                  }`}
                  style={{ borderColor: safeColor, borderWidth: 2 }}
                >
                  <FaCode style={{ color: safeColor }} className="text-2xl" />
                </motion.div>

                {/* Small decorative squares */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/4 right-0 w-3 h-3 rounded"
                  style={{ backgroundColor: safeColor }}
                />
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-1/4 left-0 w-3 h-3 rounded"
                  style={{ backgroundColor: safeColor }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2026 Irvan Nasyakban Portfolio. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Page404;