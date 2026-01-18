import React from "react";
import { FaGithub, FaFigma, FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#282C33] border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left Side - Brand & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white"></div>
              <h3 className="text-white font-bold text-xl">Elias</h3>
              <span className="text-slate-400 text-sm">elias@elias-dev.ml</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Web designer and front-end developer
            </p>
          </div>

          {/* Right Side - Media Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-lg">Media</h4>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Github"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Figma"
              >
                <FaFigma className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <FaDiscord className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            © Copyright 2026. Made by Irvan Nasyakban
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;