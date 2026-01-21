import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaBuilding,
  FaCalendarAlt
} from 'react-icons/fa';

const ListExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      getExperiences();
    } else {
      navigate('/');
    }
  }, [navigate, user]);

  const getExperiences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;

      const response = await axios.get(`${apiUrl}/experience`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both array and single object responses
      if (Array.isArray(response.data)) {
        setExperiences(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setExperiences([response.data]);
      } else {
        setExperiences([]);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.delete(`${apiUrl}/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  };

  const filteredExperiences = Array.isArray(experiences)
    ? experiences.filter(exp =>
        exp.namaPerusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.divisi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.jobdesk?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'aktif':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
      case 'selesai':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl mx-auto mb-4" style={{ color: safeColor }} />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: safeColor }}>
                <FaBriefcase className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>#experiences</h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your work experiences</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/add-experience')}
              className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: safeColor }}
            >
              <FaPlus />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark ? 'bg-[#282C33] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
              } outline-none focus:border-purple-500`}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {filteredExperiences.length === 0 ? (
            <div className={`text-center p-12 rounded-xl border ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              <FaBriefcase className="text-6xl mx-auto mb-4 opacity-50" style={{ color: safeColor }} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No Experiences Found</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm ? 'No experiences match your search.' : 'Start by adding your first work experience.'}
              </p>
              <button
                onClick={() => navigate('/add-experience')}
                className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: safeColor }}
              >
                <FaPlus className="inline mr-2" />
                Add Experience
              </button>
            </div>
          ) : (
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>#</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Company</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Division</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Period</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Job Description</th>
                      <th className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
                    {filteredExperiences.map((exp, index) => (
                      <motion.tr
                        key={exp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                      >
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaBuilding className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                            <div>
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {exp.namaPerusahaan || '-'}
                              </div>
                              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                {exp.alamat || 'No address'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {exp.divisi || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <FaCalendarAlt className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {exp.periode || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {exp.status && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exp.status)}`}>
                              {exp.status}
                            </span>
                          )}
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="max-w-xs">
                            {exp.jobdesk ? (
                              exp.jobdesk.length > 60
                                ? `${exp.jobdesk.substring(0, 60)}...`
                                : exp.jobdesk
                            ) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/edit-experience/${exp.id}`)}
                              className="p-2 rounded-lg transition-colors text-green-500 hover:bg-green-500/10"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteExperience(exp.id)}
                              className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredExperiences.length > 0 && (
            <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredExperiences.length} of {experiences.length} experiences
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ListExperience;