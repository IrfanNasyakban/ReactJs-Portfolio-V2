import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaLock,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaCheckCircle
} from 'react-icons/fa';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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
    if (!token) {
      navigate('/');
    }
  }, [navigate, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!oldPassword.trim()) {
      newErrors.oldPassword = 'Old password is required';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confNewPassword.trim()) {
      newErrors.confNewPassword = 'Confirmation password is required';
    } else if (newPassword !== confNewPassword) {
      newErrors.confNewPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      
      const response = await axios.patch(
        `${apiUrl}/change-password`,
        {
          oldPassword,
          newPassword,
          confNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfNewPassword("");
      
      // Show success message
      setSuccessMessage(response.data?.msg || "Password berhasil diubah");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Terjadi kesalahan";
      
      // Set error ke field yang sesuai
      if (errorMessage.includes("Password lama")) {
        setErrors({ oldPassword: errorMessage });
      } else if (errorMessage.includes("tidak cocok")) {
        setErrors({ confNewPassword: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

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
              <FaLock className="text-white text-2xl" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Change Password
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Update your account password for better security
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-500"
          >
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <FaCheckCircle />
              <span className="font-medium">{successMessage}</span>
            </div>
          </motion.div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-500"
          >
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <FaTimes />
              <span className="font-medium">{errors.general}</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            <div className={`rounded-xl border p-8 ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="space-y-6">
                {/* Old Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaKey className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      Current Password
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        if (errors.oldPassword) {
                          setErrors(prev => ({ ...prev, oldPassword: '' }));
                        }
                      }}
                      placeholder="Enter your current password"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                      } outline-none focus:border-purple-500 ${
                        errors.oldPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
                  )}
                </motion.div>

                {/* New Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaLock className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      New Password
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) {
                          setErrors(prev => ({ ...prev, newPassword: '' }));
                        }
                      }}
                      placeholder="Enter your new password"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                      } outline-none focus:border-purple-500 ${
                        errors.newPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                  )}
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Password must be at least 6 characters long
                  </p>
                </motion.div>

                {/* Confirm New Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaLock className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      Confirm New Password
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfPassword ? "text" : "password"}
                      value={confNewPassword}
                      onChange={(e) => {
                        setConfNewPassword(e.target.value);
                        if (errors.confNewPassword) {
                          setErrors(prev => ({ ...prev, confNewPassword: '' }));
                        }
                      }}
                      placeholder="Confirm your new password"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                      } outline-none focus:border-purple-500 ${
                        errors.confNewPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfPassword(!showConfPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {showConfPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confNewPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confNewPassword}</p>
                  )}
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
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
                  <span>{loading ? 'Changing...' : 'Change Password'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
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

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200'}`}
          >
            <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password Security Tips:
            </h3>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Use a combination of letters, numbers, and special characters</li>
              <li>• Avoid using personal information like birthdays or names</li>
              <li>• Don't reuse passwords from other accounts</li>
              <li>• Change your password regularly for better security</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;