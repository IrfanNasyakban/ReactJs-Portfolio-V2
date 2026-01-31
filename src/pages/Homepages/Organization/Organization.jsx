import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Organization = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrganizations();
  }, []);

  const getOrganizations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL_API || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/all-organizations`);
      setOrganizations(response.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id='organization' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-purple-500">#</span>organization
          </h2>
          <div className="h-[1px] bg-purple-500 flex-grow max-w-[500px]"></div>
        </div>
      </div>

      {/* Organizations Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : organizations.length === 0 ? (
        <div className="text-center py-20">
          <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No organization data available</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {organizations.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-[#282C33] border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full">
                {/* Card Header with Logo */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-700 border-2 border-gray-600 group-hover:border-purple-500 transition-colors">
                      {org.url ? (
                        <img
                          src={org.url}
                          alt={org.organisasi}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full items-center justify-center ${org.url ? 'hidden' : 'flex'}`}>
                        <FaUsers className="text-purple-500 text-3xl" />
                      </div>
                    </div>

                    {/* Organization Name */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {org.organisasi}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
                        <FaUserTie className="text-purple-400 text-xs" />
                        <span className="text-purple-300 text-sm font-medium">
                          {org.divisi}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 pb-6 space-y-3">
                  {/* Location */}
                  {org.lokasi && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-purple-400 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-gray-300 text-sm font-medium">{org.lokasi}</p>
                      </div>
                    </div>
                  )}

                  {/* Period */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                      <FaCalendarAlt className="text-purple-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Period</p>
                      <p className="text-gray-300 text-sm font-medium">{org.periode}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                      <span className="text-xs text-gray-500">Active Member</span>
                    </div>
                  </div>
                </div>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute -top-1 -right-1 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-purple-500 rounded-tr-lg"></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Decorative Dots */}
      <div className="fixed top-32 left-8 grid grid-cols-5 gap-2 opacity-40 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-slate-500 rounded-full"></div>
        ))}
      </div>

      <div className="fixed bottom-32 right-8 grid grid-cols-5 gap-2 opacity-40 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-slate-500 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default Organization;