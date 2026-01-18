import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { AiOutlineMenu, AiOutlineSetting } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

import avatar from "../assets/avatar.jpg";
import { UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ title, customFunc, icon, currentColor, currentMode }) => {
  return (
    <button
      type="button"
      onClick={() => customFunc()}
      className={`text-xl rounded-lg p-3 transition-all duration-300 ${
        currentMode === 'Dark' 
          ? 'text-gray-300 hover:bg-gray-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      title={title}
    >
      {icon}
    </button>
  );
};

const Navbar = () => {
  const [urlImage, setUrlImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
    currentColor,
    currentMode,
    setThemeSettings
  } = useStateContext();

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`; // Default purple
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const safeColor = currentColor || '#A855F7'; // Fallback to purple

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (user && user.role === "guru") {
        getProfileGuru();
      } else if (user && user.role === "siswa") {
        getProfileSiswa();
      }
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  const getProfileSiswa = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setUrlImage(profileData.url);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    }
  };

  const getProfileGuru = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-guru`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setUrlImage(profileData.url);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile guru:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const isDark = currentMode === 'Dark';

  return (
    <div 
      className={`flex justify-between items-center p-1 relative z-50 border-b ${
        isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      {/* Left Section - Menu Button */}
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        icon={<AiOutlineMenu />}
        currentColor={currentColor}
        currentMode={currentMode}
      />

      {/* Right Section - Settings & User Profile */}
      <div className="flex items-center gap-2">
        {/* Theme Settings Button */}
        <NavButton
          title="Settings"
          customFunc={() => setThemeSettings(true)}
          icon={<AiOutlineSetting />}
          currentColor={currentColor}
          currentMode={currentMode}
        />

        {/* User Profile Dropdown */}
        <div
          className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-300 relative z-50 ${
            isDark 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => handleClick("userProfile")}
        >
          <img
            className="rounded-full w-10 h-10 border-2"
            style={{ borderColor: safeColor }}
            src={urlImage && urlImage !== "http://localhost:5000/images/null" ? urlImage : avatar}
            alt="user-profile"
          />
          
          <div className="hidden md:block">
            <p 
              className={`text-sm font-semibold ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {user ? capitalizeFirstLetter(user.username) : "Admin"}
            </p>
            <p 
              className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Portfolio Admin
            </p>
          </div>
          
          <MdKeyboardArrowDown 
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>

        {/* User Profile Dropdown Menu */}
        {isClicked.userProfile && (
          <div className="absolute top-full right-0 mt-2 z-[9999]">
            <UserProfile />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;