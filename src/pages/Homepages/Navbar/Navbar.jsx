import React from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 flex justify-between items-center py-5">
          {/* Logo section */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Irvan Nasyakban
            </h1>
          </div>

          {/* Navigation Menu - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors duration-300 cursor-pointer text-sm"
              >
                #home
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors duration-300 cursor-pointer text-sm"
              >
                #works
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors duration-300 cursor-pointer text-sm"
              >
                #about-me
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors duration-300 cursor-pointer text-sm"
              >
                #contacts
              </button>
              <button
                onClick={() => navigate("/chat-ai")}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors duration-300 cursor-pointer text-sm"
              >
                #chat-AI
              </button>
            </nav>
          </div>

          {/* Language Selector */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="primary-btn"
            >
              Login {">"}
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <div className="text-slate-300 hover:text-purple-400 transition-colors duration-300 cursor-pointer">
              {isOpen ? (
                <MdClose className="text-2xl" />
              ) : (
                <MdMenu className="text-2xl" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              <button
                onClick={() => scrollToSection("hero")}
                className="block w-full text-left text-slate-300 hover:text-purple-400 font-medium py-2 transition-colors duration-300 text-sm"
              >
                #home
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="block w-full text-left text-slate-300 hover:text-purple-400 font-medium py-2 transition-colors duration-300 text-sm"
              >
                #works
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-slate-300 hover:text-purple-400 font-medium py-2 transition-colors duration-300 text-sm"
              >
                #about-me
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left text-slate-300 hover:text-purple-400 font-medium py-2 transition-colors duration-300 text-sm"
              >
                #contacts
              </button>
              <button
                onClick={() => navigate("/chat-ai")}
                className="block w-full text-left text-slate-300 hover:text-purple-400 font-medium py-2 transition-colors duration-300 text-sm"
              >
                #chat-AI
              </button>
              <div className="lg:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="primary-btn"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default Navbar;