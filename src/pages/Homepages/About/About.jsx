import React from 'react';
import { HiArrowRight } from 'react-icons/hi2';
import photo from "../../../assets/poto-bi.jpg";

const About = () => {
  return (
      <div id='about' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-xl md:text-3xl font-bold text-white">
            <span className="text-purple-500">#</span>about-me
          </h2>
          <div className="h-[1px] bg-purple-500 w-52 md:w-72"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <p className="text-slate-400 text-base leading-relaxed">
              Hello, i'm Irvan Nasyakban!
            </p>

            <p className="text-slate-400 text-base leading-relaxed">
              Having an interest in the IT world such as Fullstack Developer,
              I have a desire to present innovative and efficient technology solutions.
              And I am also interested in learning about Golang for now.
            </p>

            <p className="text-slate-400 text-base leading-relaxed">
              Transforming my creativity and knowledge into a websites has been my passion for over a year. I always strive to learn about the newest technologies and frameworks.
            </p>

            <button className="border border-purple-500 hover:bg-purple-500/10 text-white font-medium px-6 py-3 transition-all duration-300 flex items-center gap-2 group mt-6">
              Read more
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Side - Image with Decorations */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Image Container */}
            <div className="w-64 h-auto lg:w-80 lg:h-[420px] overflow-hidden relative group">
              <img 
                src={photo}
                alt="About me" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Dots overlay on image */}
              <div className="absolute top-4 right-4 grid grid-cols-5 gap-2">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white/40 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Decorative Border Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-purple-500 w-full"></div>
          </div>
        </div>
      </div>
  );
};

export default About;