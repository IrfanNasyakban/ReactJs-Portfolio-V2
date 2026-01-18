import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getMe, LogOut, reset } from "../features/authSlice";

import { MdOutlineCancel } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";

import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../assets/avatar.jpg";

const UserProfile = () => {
  const [nama, setNama] = useState(null);
  const [urlImage, setUrlImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode, setIsClicked, initialState } = useStateContext();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && user) {
      fetchUserProfile();
    }
  }, [user]);

  const isDark = currentMode === 'Dark';

  // Fetch user profile based on role
  const fetchUserProfile = async () => {
    if (!user || user.role === 'admin') return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const endpoint = user.role === "guru" ? "/profile-guru" : "/profile-siswa";
      
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data?.url) {
        setUrlImage(response.data.data.url);
        setNama(response.data.data.nama);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClicked(initialState);
  };

  const handleLogout = async () => {
    try {
      await dispatch(LogOut());
      dispatch(reset());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div 
      className={`rounded-xl w-80 shadow-2xl z-[9999] relative border ${
        isDark 
          ? 'bg-[#282C33] border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div 
        className={`p-4 rounded-t-xl border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 
              className={`font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Profile
            </h3>
            <p 
              className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Manage your account
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MdOutlineCancel className="text-lg" />
          </button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-4">
        <div 
          className={`flex gap-4 items-center p-4 rounded-lg border mb-4 ${
            isDark 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          {/* Avatar */}
          <div className="relative">
            {loading ? (
              <div 
                className="w-14 h-14 rounded-full animate-pulse"
                style={{ backgroundColor: currentColor + '40' }}
              />
            ) : (
              <img
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: currentColor }}
                src={urlImage && urlImage !== "http://localhost:5000/images/null" ? urlImage : avatar}
                alt="user-profile"
                onError={(e) => {
                  e.target.src = avatar;
                }}
              />
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <h4 
              className={`font-bold truncate ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              {nama ? capitalizeFirstLetter(nama) : capitalizeFirstLetter(user?.username || "Admin")}
            </h4>
            <p 
              className={`text-sm truncate ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {user?.email || "admin@portfolio.com"}
            </p>
            <span 
              className="text-xs px-2 py-1 rounded mt-1 inline-block"
              style={{ 
                backgroundColor: currentColor + '20',
                color: currentColor
              }}
            >
              {user?.role || 'Admin'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;