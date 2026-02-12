import React from "react";
import { FaGithub, FaFigma, FaDiscord, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#282C33] border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8">
        <div className="flex flex-col gap-8">
          {/* Top Section - Brand & Media */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8">
            {/* Left Side - Brand & Description */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white flex-shrink-0"></div>
                  <h3 className="text-white font-bold text-lg sm:text-xl">
                    Irvan Nasyakban
                  </h3>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm pl-6 sm:pl-0">
                  irvannasyakban@gmail.com
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Mobile Developer and Fullstack developer
              </p>
            </div>

            {/* Right Side - Media Links */}
            <div className="space-y-3 w-full sm:w-auto">
              <h4 className="text-white font-semibold text-base sm:text-lg">Media</h4>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/IrfanNasyakban"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Github"
                >
                  <FaGithub className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/irfannasyakban/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a 
                  href="https://discord.com/users/440934545123049474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Discord"
                >
                  <FaDiscord className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-slate-700 text-center sm:text-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              © Copyright 2026. Made by Irvan Nasyakban
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;