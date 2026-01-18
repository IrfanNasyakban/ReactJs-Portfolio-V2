import React from 'react'
import { useSelector } from "react-redux";
import { Link, NavLink } from 'react-router-dom'
import { MdOutlineCancel } from 'react-icons/md'
import { FaUser, FaProjectDiagram, FaTools, FaCertificate, FaBriefcase, FaGraduationCap, FaUsers, FaLock } from 'react-icons/fa';
import { BiSolidDashboard } from 'react-icons/bi';

import { useStateContext } from '../contexts/ContextProvider'

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor, currentMode } = useStateContext()
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || 'siswa';

  // Portfolio themed links configuration
  const allLinks = [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'dashboard',
          displayName: 'Dashboard',
          icon: <BiSolidDashboard />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
      ],
    },
  
    {
      title: 'Portfolio Management',
      links: [
        {
          name: 'biodata',
          displayName: 'Biodata',
          icon: <FaUser />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'projects',
          displayName: 'Projects',
          icon: <FaProjectDiagram />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'skills',
          displayName: 'Skills',
          icon: <FaTools />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'certificates',
          displayName: 'Certificates',
          icon: <FaCertificate />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'experience',
          displayName: 'Experience',
          icon: <FaBriefcase />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'education',
          displayName: 'Education',
          icon: <FaGraduationCap />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'organizations',
          displayName: 'Organizations',
          icon: <FaUsers />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
      ],
    },
    {
      title: 'System',
      links: [
        {
          name: 'ganti-password',
          displayName: 'Change Password',
          icon: <FaLock />,
          allowedRoles: ['siswa', 'guru', 'admin']
        },
        {
          name: 'users',
          displayName: 'Users',
          icon: <FaUsers />,
          allowedRoles: ['admin']
        },
      ],
    },
  ];

  // Filter links based on user role
  const filterLinksByRole = (links, role) => {
    const filteredCategories = links.map(category => {
      const filteredLinks = category.links.filter(link => 
        link.allowedRoles.includes(role)
      );
      
      return {
        ...category,
        links: filteredLinks
      };
    });
    
    return filteredCategories.filter(category => category.links.length > 0);
  };

  const links = filterLinksByRole(allLinks, userRole);

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900){
      setActiveMenu(false)
    }
  }

  const isDark = currentMode === 'Dark';

  // Dynamic link styles
  const activeLink = `flex items-center gap-3 pl-4 pt-3 pb-3 rounded-lg text-white text-sm m-2 font-medium transition-all duration-300`;
  
  const normalLink = `flex items-center gap-3 pl-4 pt-3 pb-3 rounded-lg text-sm m-2 transition-all duration-300 ${
    isDark 
      ? 'text-gray-300 hover:bg-gray-700' 
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return (
    <div 
      className={`ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 ${
        isDark ? 'bg-[#282C33]' : 'bg-white'
      }`}
      style={{ 
        borderRight: `1px solid ${isDark ? '#374151' : '#E5E7EB'}` 
      }}
    >
      {activeMenu && (<>
        {/* Header Section */}
        <div 
          className={`flex justify-between items-center pb-4 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Link 
            to="/dashboard" 
            onClick={handleCloseSideBar} 
            className={`items-center gap-3 ml-3 mt-4 flex text-lg font-bold tracking-tight transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            <div>
              <span style={{ color: currentColor }}>Irvan</span>
              <span> Portfolio</span>
            </div>
          </Link>
          
          <button 
            type='button' 
            onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} 
            className={`text-xl rounded-lg p-2 mt-4 mr-3 block md:hidden transition-colors duration-300 ${
              isDark 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MdOutlineCancel />
          </button>
        </div>

        {/* Navigation Links */}
        <div className='mt-6 px-2'>
          {links.map((item) => (
            <div key={item.title} className="mb-6">
              {/* Section Header */}
              <p 
                className={`text-xs font-semibold uppercase tracking-wider mx-4 mb-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                #{item.title.toLowerCase().replace(' ', '-')}
              </p>
              
              {/* Navigation Items */}
              {item.links.map((link) => (
                <NavLink 
                  to={`/${link.name}`} 
                  key={link.name} 
                  onClick={handleCloseSideBar} 
                  className={({ isActive }) => 
                    isActive ? activeLink : normalLink
                  }
                  style={({ isActive }) => 
                    isActive 
                      ? { backgroundColor: currentColor }
                      : {}
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className='font-medium'>{link.displayName}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Decorative grid pattern at bottom */}
        <div className="absolute bottom-10 left-10 grid grid-cols-5 gap-2 opacity-20 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div 
              key={`sidebar-grid-${i}`} 
              className="w-1 h-1"
              style={{ backgroundColor: currentColor }}
            />
          ))}
        </div>
      </>)}
    </div>
  )
}

export default Sidebar