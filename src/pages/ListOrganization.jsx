import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaSitemap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage
} from 'react-icons/fa';

const ListOrganization = () => {
  const [organizations, setOrganizations] = useState([]);
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
      getOrganizations();
    } else {
      navigate('/');
    }
  }, [navigate, user]);

  const getOrganizations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;

      const response = await axios.get(`${apiUrl}/organizations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both array and single object responses
      if (Array.isArray(response.data)) {
        setOrganizations(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setOrganizations([response.data]);
      } else {
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.delete(`${apiUrl}/organizations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Failed to delete organization');
    }
  };

  const filteredOrganizations = Array.isArray(organizations)
    ? organizations.filter(org =>
        org.organisasi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.divisi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.lokasi?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl mx-auto mb-4" style={{ color: safeColor }} />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading organizations...</p>
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
                <FaUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>#organizations</h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your organizational activities</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/add-organizations')}
              className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: safeColor }}
            >
              <FaPlus />
              <span>Add Organization</span>
            </button>
          </div>

          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark ? 'bg-[#282C33] border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
              } outline-none focus:border-purple-500`}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {filteredOrganizations.length === 0 ? (
            <div className={`text-center p-12 rounded-xl border ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              <FaUsers className="text-6xl mx-auto mb-4 opacity-50" style={{ color: safeColor }} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No Organizations Found</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm ? 'No organizations match your search.' : 'Start by adding your first organizational activity.'}
              </p>
              <button
                onClick={() => navigate('/add-organizations')}
                className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: safeColor }}
              >
                <FaPlus className="inline mr-2" />
                Add Organization
              </button>
            </div>
          ) : (
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>#</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Organization</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Division</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Location</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Period</th>
                      <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Logo</th>
                      <th className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
                    {filteredOrganizations.map((org, index) => (
                      <motion.tr
                        key={org.id}
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
                            <FaSitemap className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                            <div>
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {org.organisasi || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {org.divisi || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <FaMapMarkerAlt className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {org.lokasi || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <FaCalendarAlt className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {org.periode || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {org.url ? (
                            <img 
                              src={org.url} 
                              alt={org.organisasi} 
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-12 h-12 rounded-lg items-center justify-center ${org.url ? 'hidden' : 'flex'}`}
                            style={{ backgroundColor: getColorWithOpacity(safeColor, 0.1) }}
                          >
                            <FaImage style={{ color: safeColor }} className="text-sm" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/edit-organizations/${org.id}`)}
                              className="p-2 rounded-lg transition-colors text-green-500 hover:bg-green-500/10"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteOrganization(org.id)}
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

          {filteredOrganizations.length > 0 && (
            <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredOrganizations.length} of {organizations.length} organizations
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ListOrganization;