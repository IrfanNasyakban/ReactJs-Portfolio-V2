import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDiscord } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';

const Contact = () => {
  const navigate = useNavigate();

  return (
      <div id='contact' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-purple-500">#</span>contacts
          </h2>
          <div className="h-[1px] bg-purple-500 w-40"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Description */}
          <div>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              I'm interested in freelance opportunities. However, if you have other request or question, don't hesitate to contact me
            </p>
          </div>

          {/* Right Side - Contact Box */}
          <div className="flex justify-start lg:justify-end">
            <div className="border border-slate-500 p-6 w-full max-w-xs">
              <h3 className="text-white font-semibold text-base mb-4">
                Message me here
              </h3>
              
              <div className="space-y-3">
                {/* Discord */}
                <a
                  href="https://discord.com/users/440934545123049474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <FaDiscord className="w-5 h-5" />
                  <span className="text-sm">irvannasyakban</span>
                </a>

                {/* Email */}
                <a 
                  href="mailto:irvannasyakban@gmail.com" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <HiMail className="w-5 h-5" />
                  <span className="text-sm">irvannasyakban@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Contact;