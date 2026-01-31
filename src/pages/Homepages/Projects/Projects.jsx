import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/all-project`);
      const sortedProjects = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setProjects(sortedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to parse comma-separated tech stack
  const parseTechStack = (techStackString) => {
    if (!techStackString) return [];
    return techStackString.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
  };

  // Loading state
  if (loading) {
    return (
      <div id='projects' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400 text-lg">Loading projects...</div>
        </div>
      </div>
    );
  }

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
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const techStackArray = parseTechStack(project.techStack);
            const hasLiveLink = project.link && project.link !== '-' && project.link !== '';
            const hasGithubLink = project.github && project.github !== '-' && project.github !== '';

            return (
              <div key={project.id} className="border border-slate-600 hover:border-purple-500 transition-all duration-300 group">
                {/* Project Image */}
                <div className="h-52 overflow-hidden bg-slate-800">
                  <img 
                    src={project.url} 
                    alt={project.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop';
                    }}
                  />
                </div>

                {/* Tech Stack Tags */}
                <div className="border-t border-slate-600 p-3">
                  <div className="flex flex-wrap gap-2">
                    {techStackArray.length > 0 ? (
                      techStackArray.map((tech, index) => (
                        <span key={index} className="text-slate-400 text-sm">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm italic">No tech stack specified</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 bg-[#282C33]">
                  <h3 className="text-xl font-semibold text-white">
                    {project.judul}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {project.deskripsi}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    {/* Live Link Button */}
                    {hasLiveLink && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border border-purple-500 text-white hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2"
                      >
                        Live
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* GitHub Link Button */}
                    {hasGithubLink && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-white transition-all duration-300 flex items-center gap-2"
                      >
                        GitHub
                        <FiGithub className="w-4 h-4" />
                      </a>
                    )}

                    {/* Show message if no links available */}
                    {!hasLiveLink && !hasGithubLink && (
                      <span className="text-slate-500 text-sm italic py-2">
                        No links available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decorative Dots */}
      <div className="fixed top-32 left-8 grid grid-cols-5 gap-2 opacity-40 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-slate-500 rounded-full"></div>
        ))}
      </div>

      <div className="fixed bottom-32 right-8 grid grid-cols-5 gap-2 opacity-40 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-slate-500 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default Projects;