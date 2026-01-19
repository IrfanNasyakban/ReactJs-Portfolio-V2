import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { motion } from 'framer-motion';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaCalendar,
  FaVenusMars,
  FaImage,
  FaSpinner
} from 'react-icons/fa';

const BiodataPage = () => {
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("berhasil");
      } else {
        navigate("/");
      }
    }, [navigate, user]);

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    getBiodata();
  }, []);

  const getBiodata = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;
      
      const response = await axios.get(`${apiUrl}/biodata`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setBiodata(response.data);
      }
    } catch (err) {
      console.error('Error fetching biodata:', err);
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
          <FaSpinner 
            className="animate-spin text-6xl mx-auto mb-4" 
            style={{ color: safeColor }}
          />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading biodata...
          </p>
        </div>
      </div>
    );
  }

  // Error State - Biodata Not Found
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
              <FaUser className="text-4xl" style={{ color: safeColor }} />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Biodata Not Found
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              You haven't created your biodata yet. Create one to complete your profile.
            </p>
            <button
              onClick={() => navigate('/biodata/create')}
              className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: safeColor }}
            >
              Create Biodata
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
            Failed to load biodata. Please try again.
          </p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: safeColor }}
              >
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  #biodata
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Personal Information
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/edit-biodata/${biodata.id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: safeColor, color: 'white' }}
            >
              <FaEdit />
              <span>Edit</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div 
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Profile Image */}
              <div className="mb-6">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                  {biodata?.url ? (
                    <img
                      src={biodata.url}
                      alt={biodata.nama || 'Profile'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full flex items-center justify-center ${
                      biodata?.url ? 'hidden' : 'flex'
                    }`}
                    style={{ backgroundColor: getColorWithOpacity(safeColor, 0.1) }}
                  >
                    <FaImage className="text-6xl" style={{ color: safeColor }} />
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {biodata?.nama || 'No Name'}
                </h2>
                <p 
                  className="text-sm font-medium px-3 py-1 rounded-full inline-block"
                  style={{ 
                    backgroundColor: getColorWithOpacity(safeColor, 0.1),
                    color: safeColor
                  }}
                >
                  {biodata?.gender || 'Not specified'}
                </p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <FaEnvelope style={{ color: safeColor }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Email
                    </p>
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {biodata?.email || '-'}
                    </p>
                  </div>
                </div>

                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <FaPhone style={{ color: safeColor }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Phone
                    </p>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {biodata?.noHp || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Card - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div 
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Detailed Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Gender */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaVenusMars style={{ color: safeColor }} />
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gender
                    </label>
                  </div>
                  <p className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {biodata?.gender || '-'}
                  </p>
                </div>

                {/* Birth Date */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendar style={{ color: safeColor }} />
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Date of Birth
                    </label>
                  </div>
                  <p className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {formatDate(biodata?.tglLahir)}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaEnvelope style={{ color: safeColor }} />
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email Address
                    </label>
                  </div>
                  <p className={`text-base break-all ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {biodata?.email || '-'}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaPhone style={{ color: safeColor }} />
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Phone Number
                    </label>
                  </div>
                  <p className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {biodata?.noHp || '-'}
                  </p>
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt style={{ color: safeColor }} />
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Address
                    </label>
                  </div>
                  <p className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {biodata?.alamat || '-'}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div 
                className={`mt-6 pt-6 border-t grid md:grid-cols-2 gap-4 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Created At
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(biodata?.createdAt)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Last Updated
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(biodata?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BiodataPage;