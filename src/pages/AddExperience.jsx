import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaBriefcase,
  FaSave,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle
} from 'react-icons/fa';

const AddExperience = () => {
  const [formData, setFormData] = useState({
    namaPerusahaan: '',
    divisi: '',
    alamat: '',
    status: '',
    periode: '',
    jobdesk: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode } = useStateContext();

  const safeColor = currentColor || '#A855F7';
  const isDark = currentMode === 'Dark';

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' }
  ];

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate, user]);

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
    
    if (!formData.namaPerusahaan.trim()) {
      newErrors.namaPerusahaan = 'Company name is required';
    }

    if (!formData.divisi.trim()) {
      newErrors.divisi = 'Division is required';
    }

    if (!formData.periode.trim()) {
      newErrors.periode = 'Period is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.jobdesk.trim()) {
      newErrors.jobdesk = 'Job description is required';
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

      await axios.post(`${apiUrl}/experience`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/experience');
    } catch (error) {
      console.error('Error adding experience:', error);
      alert(error.response?.data?.message || 'Failed to add experience');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/list-experience');
    }
  };

  const inputFields = [
    {
      name: 'namaPerusahaan',
      label: 'Company Name',
      icon: FaBuilding,
      type: 'text',
      placeholder: 'e.g., Google Inc.',
      required: true
    },
    {
      name: 'divisi',
      label: 'Division / Position',
      icon: FaUserTie,
      type: 'text',
      placeholder: 'e.g., Software Engineer, Marketing',
      required: true
    },
    {
      name: 'alamat',
      label: 'Company Address',
      icon: FaMapMarkerAlt,
      type: 'text',
      placeholder: 'e.g., Jakarta, Indonesia',
      required: false
    },
    {
      name: 'periode',
      label: 'Work Period',
      icon: FaCalendarAlt,
      type: 'text',
      placeholder: 'e.g., Jan 2020 - Dec 2022, 2020 - Present',
      required: true
    }
  ];

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
              <FaBriefcase className="text-white text-2xl" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Add New Experience
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your work experience to showcase your career journey
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
                {/* Text Input Fields */}
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
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
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
                  </motion.div>
                ))}

                {/* Status Select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      Status
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    } outline-none focus:border-purple-500 ${
                      errors.status ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                  )}
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Active: Currently working, Completed: Past experience
                  </p>
                </motion.div>

                {/* Job Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaClipboardList className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      Job Description
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <textarea
                    name="jobdesk"
                    value={formData.jobdesk}
                    onChange={handleChange}
                    placeholder="Describe your responsibilities and achievements..."
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } outline-none focus:border-purple-500 ${
                      errors.jobdesk ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.jobdesk && (
                    <p className="mt-1 text-sm text-red-500">{errors.jobdesk}</p>
                  )}
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Detail your key responsibilities, achievements, and skills gained
                  </p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
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
                  <span>{loading ? 'Saving...' : 'Save Experience'}</span>
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
            transition={{ delay: 0.8 }}
            className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200'}`}
          >
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Tip:</strong> Be specific about your role and achievements. Include quantifiable results where possible (e.g., "Increased sales by 30%", "Led a team of 5 developers").
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddExperience;