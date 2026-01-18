import React from 'react';
import { HiArrowRight } from 'react-icons/hi2';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "ChertNodes",
      description: "Minecraft servers hosting",
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400&h=300&fit=crop",
      tags: ["HTML", "SCSS", "Python", "Flask"],
      buttons: [
        { label: "Live", icon: true, variant: "primary" },
        { label: "Cached", icon: true, variant: "secondary" }
      ]
    },
    {
      id: 2,
      title: "ProtectX",
      description: "Discord anti-crash bot",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=300&fit=crop",
      tags: ["React", "Express", "Discord.js", "Node.js"],
      tech: ["HTML", "SCSS", "Python", "Flask"],
      buttons: [
        { label: "Live", icon: true, variant: "primary" }
      ]
    },
    {
      id: 3,
      title: "Kahoot Answers Viewer",
      description: "Get answers to your kahoot quiz",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
      tags: ["CSS", "Express", "Node.js"],
      buttons: [
        { label: "Live", icon: true, variant: "primary" }
      ]
    }
  ];

  return (
      <div id='projects' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-purple-500">#</span>projects
            </h2>
            <div className="h-[1px] bg-purple-500 flex-grow max-w-[500px]"></div>
          </div>
          <a href="#" className="text-white hover:text-purple-500 transition-colors flex items-center gap-2 group">
            View all
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-slate-600 hover:border-purple-500 transition-all duration-300 group">
              {/* Project Image */}
              <div className="h-52 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Tags */}
              <div className="border-t border-slate-600 p-3">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="text-slate-400 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 bg-[#282C33]">
                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {project.description}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  {project.buttons.map((button, index) => (
                    <button
                      key={index}
                      className={`
                        px-6 py-2 border transition-all duration-300 flex items-center gap-2
                        ${button.variant === 'primary' 
                          ? 'border-purple-500 text-white hover:bg-purple-500/10' 
                          : 'border-slate-600 text-slate-400 hover:border-slate-500'
                        }
                      `}
                    >
                      {button.label}
                      {button.icon && <span className="text-sm">↔</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Dots */}
        <div className="fixed top-32 left-8 grid grid-cols-5 gap-2 opacity-40">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-500 rounded-full"></div>
          ))}
        </div>

        <div className="fixed bottom-32 right-8 grid grid-cols-5 gap-2 opacity-40">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-500 rounded-full"></div>
          ))}
        </div>
      </div>
  );
};

export default Projects;