import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaCode,
  FaSave,
  FaTimes,
  FaDatabase,
  FaTools,
  FaLayerGroup,
  FaEllipsisH,
  FaSpinner
} from 'react-icons/fa';

const EditSkill = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    languages: '',
    databases: '',
    tools: '',
    frameworks: '',
    other: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode } = useStateContext();

  const safeColor = currentColor || '#A855F7';
  const isDark = currentMode === 'Dark';

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getSkillById();
    } else {
      navigate('/');
    }
  }, [navigate, user]);

  const getSkillById = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;

      const response = await axios.get(`${apiUrl}/skill/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setFormData({
          languages: response.data.languages || '',
          databases: response.data.databases || '',
          tools: response.data.tools || '',
          frameworks: response.data.frameworks || '',
          other: response.data.other || ''
        });
      }
    } catch (error) {
      console.error('Error fetching skill:', error);
      alert('Failed to load skill data');
      navigate('/skills');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.languages.trim()) {
      newErrors.languages = 'Languages is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;

      await axios.patch(`${apiUrl}/skill/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/skills');
    } catch (error) {
      console.error('Error updating skill:', error);
      alert(error.response?.data?.message || 'Failed to update skill');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/skills');
    }
  };

  const inputFields = [
    {
      name: 'languages',
      label: 'Languages',
      icon: FaCode,
      placeholder: 'e.g., JavaScript, Python, Java, C++',
      required: true
    },
    {
      name: 'databases',
      label: 'Databases',
      icon: FaDatabase,
      placeholder: 'e.g., MySQL, PostgreSQL, MongoDB, Redis'
    },
    {
      name: 'tools',
      label: 'Tools',
      icon: FaTools,
      placeholder: 'e.g., Git, Docker, VS Code, Postman'
    },
    {
      name: 'frameworks',
      label: 'Frameworks',
      icon: FaLayerGroup,
      placeholder: 'e.g., React, Node.js, Express, Laravel'
    },
    {
      name: 'other',
      label: 'Other',
      icon: FaEllipsisH,
      placeholder: 'e.g., Agile, REST API, GraphQL'
    }
  ];

  // Loading State
  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl mx-auto mb-4" style={{ color: safeColor }} />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading skill data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Background Decorations */}
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: safeColor }}>
              <FaCode className="text-white text-2xl" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Edit Skill
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Update your technical skills
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            <div className={`rounded-xl border p-8 ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="space-y-6">
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <field.icon className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </div>
                    </label>
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                      } outline-none focus:border-purple-500 ${
                        errors[field.name] ? 'border-red-500' : ''
                      }`}
                    />
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                    )}
                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      Separate multiple items with commas
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 mt-8 pt-6 border-t"
                style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaSave />
                  <span>{loading ? 'Updating...' : 'Update Skill'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </motion.div>
            </div>
          </form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200'}`}
          >
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Tip:</strong> List your skills separated by commas. Be specific and include your proficiency level if needed (e.g., "JavaScript (Expert), Python (Intermediate)").
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditSkill;