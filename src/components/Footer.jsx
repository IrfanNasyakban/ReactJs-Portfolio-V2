import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const { currentColor, currentMode } = useStateContext();

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const isDark = currentMode === 'Dark';

  return (
    <div className="mt-16 relative">
      {/* Decorative top border */}
      <div 
        className="h-px w-full"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${currentColor}, transparent)` 
        }}
      />
      
      {/* Footer Content */}
      <footer 
        className={`py-8 px-6 ${
          isDark ? 'bg-[#1E2128]' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h3 
                className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Irvan <span style={{ color: currentColor }}>Nasyakban</span>
              </h3>
              <p 
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Web designer and full-stack developer
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 
                className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                {['Home', 'Works', 'About Me', 'Contacts'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className={`text-sm transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      style={{
                        ':hover': { color: currentColor }
                      }}
                      onMouseEnter={(e) => e.target.style.color = currentColor}
                      onMouseLeave={(e) => e.target.style.color = ''}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 
                className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Media
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: <FaGithub />, label: 'GitHub' },
                  { icon: <FaLinkedin />, label: 'LinkedIn' },
                  { icon: <FaInstagram />, label: 'Instagram' },
                  { icon: <FaEnvelope />, label: 'Email' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = getColorWithOpacity(currentColor, 0.1);
                      e.currentTarget.style.color = currentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div 
            className="pt-6 border-t text-center"
            style={{ 
              borderColor: getColorWithOpacity(currentColor, 0.2) 
            }}
          >
            <p 
              className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              © Copyright 2026. Made by{' '}
              <span style={{ color: currentColor }} className="font-semibold">
                Irvan Nasyakban
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 grid grid-cols-5 gap-2 opacity-20 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div 
            key={`footer-grid-${i}`} 
            className="w-1 h-1"
            style={{ backgroundColor: currentColor }}
          />
        ))}
      </div>
    </div>
  );
};

export default Footer;