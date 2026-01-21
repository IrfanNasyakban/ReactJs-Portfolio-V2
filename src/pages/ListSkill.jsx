import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaCode,
  FaEdit,
  FaDatabase,
  FaTools,
  FaLayerGroup,
  FaEllipsisH,
  FaSpinner,
  FaCalendar
} from 'react-icons/fa';

const ListSkill = () => {
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode } = useStateContext();

  const safeColor = currentColor || '#A855F7';
  const isDark = currentMode === 'Dark';

  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getSkill();
    } else {
      navigate('/');
    }
  }, [navigate, user]);

  const getSkill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;

      const response = await axios.get(`${apiUrl}/skill`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setSkill(response.data);
      }
    } catch (err) {
      console.error('Error fetching skill:', err);
      setError(err.response?.status === 404 ? 'not_found' : 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl mx-auto mb-4" style={{ color: safeColor }} />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading skills...</p>
        </div>
      </div>
    );
  }

  // Error State - Skill Not Found
  if (error === 'not_found') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-12 rounded-xl border ${
              isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: getColorWithOpacity(safeColor, 0.1) }}
            >
              <FaCode className="text-4xl" style={{ color: safeColor }} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Skills Not Found
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              You haven't added your skills yet. Add your technical skills to showcase your expertise.
            </p>
            <button
              onClick={() => navigate('/add-skills')}
              className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: safeColor }}
            >
              Add Skills
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State - General Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Failed to load skills. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: FaCode,
      data: skill?.languages,
      color: '#10B981'
    },
    {
      title: 'Databases',
      icon: FaDatabase,
      data: skill?.databases,
      color: '#3B82F6'
    },
    {
      title: 'Tools',
      icon: FaTools,
      data: skill?.tools,
      color: '#F59E0B'
    },
    {
      title: 'Frameworks',
      icon: FaLayerGroup,
      data: skill?.frameworks,
      color: '#8B5CF6'
    },
    {
      title: 'Other Skills',
      icon: FaEllipsisH,
      data: skill?.other,
      color: '#EC4899'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={`top-${i}`} className="w-1 h-1" style={{ backgroundColor: safeColor }}></div>
          ))}
        </div>
        <div className="absolute bottom-20 right-20 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={`bottom-${i}`} className="w-1 h-1" style={{ backgroundColor: safeColor }}></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: safeColor }}>
                <FaCode className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  #skills
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Technical Skills & Expertise
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/edit-skills/${skill.id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: safeColor, color: 'white' }}
            >
              <FaEdit />
              <span>Edit</span>
            </button>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: getColorWithOpacity(category.color, 0.1) }}
                >
                  <category.icon className="text-xl" style={{ color: category.color }} />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {category.title}
                </h3>
              </div>
              
              <div className={`min-h-[80px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {category.data ? (
                  <div className="space-y-2">
                    {category.data.split(',').map((item, idx) => (
                      <div 
                        key={idx}
                        className={`inline-block mr-2 mb-2 px-3 py-1.5 rounded-lg text-sm ${
                          isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        {item.trim()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No data added yet
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Info & Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-xl border ${
            isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Information
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Owner */}
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Owner
              </p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {skill?.user?.username || '-'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {skill?.user?.email || '-'}
              </p>
            </div>

            {/* Created At */}
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Created At
              </p>
              <div className="flex items-center gap-2">
                <FaCalendar style={{ color: safeColor }} className="text-sm" />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDate(skill?.createdAt)}
                </p>
              </div>
            </div>

            {/* Updated At */}
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Last Updated
              </p>
              <div className="flex items-center gap-2">
                <FaCalendar style={{ color: safeColor }} className="text-sm" />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDate(skill?.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ListSkill;