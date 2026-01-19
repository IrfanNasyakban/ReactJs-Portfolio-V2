import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe, LogOut, reset } from "../features/authSlice";
import { motion } from "framer-motion";
import { useStateContext } from "../contexts/ContextProvider";

import {
  FaProjectDiagram,
  FaTools,
  FaCertificate,
  FaBriefcase,
  FaCode,
  FaLaptopCode,
  FaRocket,
  FaEye,
  FaSignOutAlt,
  FaInfoCircle,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const Dashboard = () => {
  // State management
  const [portfolioStats, setPortfolioStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    skills: 0,
    certificates: 0,
    experience: 0,
    education: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [loading, setLoading] = useState(false);

  // Context
  const { currentColor, currentMode } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Helper function for colors with fallback
  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`; // Default purple
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const safeColor = currentColor || '#A855F7'; // Fallback to purple
  const isDark = currentMode === 'Dark';

  // Dashboard cards data
  const dashboardCards = [
    {
      icon: <FaProjectDiagram />,
      count: portfolioStats.totalProjects,
      title: "Projects",
      subtitle: "Completed projects",
      color: safeColor,
      navigateTo: "/projects",
      onClick: () => navigate("/projects")
    },
    {
      icon: <FaTools />,
      count: portfolioStats.skills,
      title: "Skills",
      subtitle: "Technical & soft skills",
      color: safeColor,
      navigateTo: "/skills",
      onClick: () => navigate("/skills")
    },
    {
      icon: <FaCertificate />,
      count: portfolioStats.certificates,
      title: "Certificates",
      subtitle: "Professional certifications",
      color: safeColor,
      navigateTo: "/certificates",
      onClick: () => navigate("/certificates")
    },
    {
      icon: <FaBriefcase />,
      count: portfolioStats.experience,
      title: "Experience",
      subtitle: "Years of work experience",
      color: safeColor,
      navigateTo: "/experience",
      onClick: () => navigate("/experience")
    },
  ];

  // Featured skills
  const featuredSkills = [
    { name: "React.js", level: 90, icon: "⚛️" },
    { name: "Node.js", level: 85, icon: "🟢" },
    { name: "Python", level: 80, icon: "🐍" },
    { name: "JavaScript", level: 95, icon: "💛" },
    { name: "TypeScript", level: 75, icon: "🔷" },
    { name: "MongoDB", level: 85, icon: "🍃" }
  ];

  const handleLogout = async () => {
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };
  
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchPortfolioData();
      checkUserProfile();
    } else {
      navigate("/");
    }
  }, [navigate, user]);

  // API Functions
  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch portfolio data (adjust endpoints as needed)
      const [projectsRes, skillsRes, certsRes, expRes, eduRes] = await Promise.all([
        axios.get(`${apiUrl}/projects`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/skills`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/certificates`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/experience`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/education`, { headers }).catch(() => ({ data: [] }))
      ]);

      setPortfolioStats({
        totalProjects: projectsRes.data.length || 12,
        completedProjects: projectsRes.data.filter(p => p.status === 'completed').length || 10,
        skills: skillsRes.data.length || 15,
        certificates: certsRes.data.length || 8,
        experience: expRes.data.length || 3,
        education: eduRes.data.length || 2
      });
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      // Set default values if API fails
      setPortfolioStats({
        totalProjects: 12,
        completedProjects: 10,
        skills: 15,
        certificates: 8,
        experience: 3,
        education: 2
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserProfile = async () => {
    if (!user || user.role === "admin") return;

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const endpoint = "/biodata";
      
      await axios.get(`${apiUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (error.response?.status === 404) {
        const message = "Your biodata hasn't been created yet. Please complete your profile to continue.";
        const path = "/biodata";
        
        setModalMessage(message);
        setRedirectPath(path);
        setShowModal(true);
      }
    }
  };

  // Event handlers
  const handleModalConfirm = () => {
    setShowModal(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div 
            className={`p-8 rounded-2xl border ${
              isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaCode className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Welcome back, <span style={{ color: safeColor }}>Irvan</span>
                  </h1>
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Web developer and fullstack developer
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div 
                  className="px-4 py-2 rounded-lg border"
                  style={{ 
                    backgroundColor: getColorWithOpacity(safeColor, 0.1),
                    borderColor: safeColor
                  }}
                >
                  <p className="text-sm" style={{ color: safeColor }}>
                    Currently working on <strong>Portfolio</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {dashboardCards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group cursor-pointer"
              onClick={item.onClick}
            >
              <div 
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: safeColor }}
                  >
                    <span className="text-white text-xl">{item.icon}</span>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: safeColor }}
                    >
                      {loading ? "..." : item.count}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div 
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaLaptopCode className="text-white text-xl" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    #skills
                  </h2>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Technical expertise
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {featuredSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{skill.icon}</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {skill.name}
                        </span>
                      </div>
                      <span className="font-bold" style={{ color: safeColor }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: safeColor }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/skills')}
                className="w-full mt-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: safeColor }}
              >
                View All Skills
              </button>
            </div>
          </motion.div>

          {/* Quick Stats & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div 
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaRocket className="text-white text-xl" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    #about
                  </h2>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Professional summary
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div 
                  className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Current Focus
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Building responsive websites where technologies meet creativity
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: getColorWithOpacity(safeColor, 0.1) }}
                  >
                    <div className="text-2xl font-bold" style={{ color: safeColor }}>
                      {portfolioStats.completedProjects}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completed
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: getColorWithOpacity(safeColor, 0.1) }}
                  >
                    <div className="text-2xl font-bold" style={{ color: safeColor }}>
                      {portfolioStats.experience}+
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Years Exp
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div 
                className={`p-4 rounded-lg border-l-4 ${
                  isDark ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}
                style={{ borderColor: safeColor }}
              >
                <p className={`text-sm italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  "With great power comes great responsibility"
                </p>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  - Uncle Ben
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                <a
                  href="#"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaGithub />
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="#"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaLinkedin />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div 
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaProjectDiagram className="text-white text-xl" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    #projects
                  </h2>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Featured works
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-sm font-medium transition-colors"
                style={{ color: safeColor }}
              >
                View all →
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((project) => (
                <div 
                  key={project}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isDark ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div 
                    className="h-32 rounded-lg mb-3"
                    style={{ backgroundColor: getColorWithOpacity(safeColor, 0.2) }}
                  >
                    {/* Project thumbnail placeholder */}
                  </div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Project {project}
                  </h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Description of the project
                  </p>
                  <div className="flex gap-2">
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: getColorWithOpacity(safeColor, 0.2),
                        color: safeColor
                      }}
                    >
                      React
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: getColorWithOpacity(safeColor, 0.2),
                        color: safeColor
                      }}
                    >
                      Node.js
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleLogout}
          ></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`relative w-full max-w-lg mx-auto rounded-xl shadow-2xl z-10 border ${
              isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div 
              className="px-6 py-4 rounded-t-xl"
              style={{ backgroundColor: safeColor }}
            >
              <div className="flex items-center gap-3">
                <FaInfoCircle className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold text-white">
                  Profile Required
                </h3>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {modalMessage}
              </p>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: getColorWithOpacity(safeColor, 0.2) }}>
              <button
                className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-300"
                style={{ backgroundColor: safeColor }}
                onClick={handleModalConfirm}
              >
                <FaEye className="inline mr-2" />
                Complete Profile
              </button>
              <button
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="inline mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;