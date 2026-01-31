import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import photo from "../../../assets/poto-bi.jpg";

const Hero = () => {
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
    <div
      id="hero"
      className="relative overflow-hidden min-h-screen flex items-center"
    >

      {/* Dots Pattern - Right Top */}
      <div className="hidden md:grid absolute top-32 right-10 lg:right-32 grid-cols-5 gap-2">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-purple-500 rounded-full"></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 lg:pt-8"
          >
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              style={{ lineHeight: 1.4 }}
            >
              Irvan Na'syakban is a{" "}
              <span className="text-purple-500">android developer</span> and{" "}
              <span className="text-purple-500">fullstack developer</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-md">
              I'm crafts responsive websites where technologies meet creativity
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => scrollToSection("contact")} className="border border-purple-500 hover:bg-purple-500/10 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 transition-all duration-300">
                Contact me!!
              </button>

              <button onClick={() => navigate('/chat-ai')} className="border border-slate-400 hover:bg-slate-400/10 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 transition-all duration-300">
                Ask About me
              </button>
            </div>
          </motion.div>

          {/* Right Content - Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main Image Container */}
            <div className="relative">
              <div className="w-64 h-auto sm:w-72 sm:h-auto lg:w-80 lg:h-[420px] overflow-hidden relative group">
                <img
                  src={photo}
                  alt="Elias"
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Dots overlay on image */}
                <div className="absolute top-4 right-4 grid grid-cols-5 gap-2">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-white/40 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-4 left-0 right-0 mx-auto w-max bg-slate-800 border border-slate-700 px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3"
              >
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500"></div>
                <span className="text-slate-300 text-xs sm:text-sm">
                  Currently working on{" "}
                  <span className="text-white font-medium">Portfolio</span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 sm:mt-16 lg:mt-20 max-w-3xl"
        >
          <div className="relative border border-slate-400 p-6 sm:p-8 md:p-10">
            {/* Opening Quote */}
            <div className="absolute -top-3 left-4 sm:left-6 text-3xl sm:text-4xl text-slate-400">
              "
            </div>

            <p className="text-white text-base sm:text-lg md:text-xl font-light mb-4 sm:mb-6">
              With great power comes great responsibility
            </p>

            {/* Closing Quote */}
            <div className="absolute -bottom-3 right-4 sm:right-6 text-3xl sm:text-4xl text-slate-400">
              "
            </div>

            {/* Author */}
            <div className="flex justify-end">
              <div className="border border-slate-400 px-3 sm:px-4 py-1.5 sm:py-2">
                <p className="text-slate-400 text-xs sm:text-sm">- Uncle Ben</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;