import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getExperiences();
  }, []);

  const getExperiences = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL_API || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/all-experience`);
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status?.toLowerCase() === 'active' 
      ? 'bg-green-500/10 border-green-500/30 text-green-400'
      : 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  };

  const getStatusIcon = (status) => {
    return status?.toLowerCase() === 'active' ? FaClock : FaCheckCircle;
  };

  return (
    <div id='experience' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-purple-500">#</span>experience
          </h2>
          <div className="h-[1px] bg-purple-500 flex-grow max-w-[500px]"></div>
        </div>
      </div>

      {/* Experience List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-20">
          <FaBriefcase className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No experience data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const StatusIcon = getStatusIcon(exp.status);
            
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Timeline Connector */}
                {index !== experiences.length - 1 && (
                  <div className="hidden md:block absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-purple-500 to-transparent"></div>
                )}

                {/* Card */}
                <div className="relative bg-[#282C33] border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-6 top-6 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#1e1e2e] z-10">
                    <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75"></div>
                  </div>

                  <div className="md:pl-16 p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-grow">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                            <FaBriefcase className="text-purple-400 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                              {exp.namaPerusahaan}
                            </h3>
                            <p className="text-purple-300 font-medium">{exp.divisi}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(exp.status)} flex-shrink-0`}>
                        <StatusIcon className="text-sm" />
                        <span className="text-sm font-medium">{exp.status}</span>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {/* Location */}
                      {exp.alamat && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaMapMarkerAlt className="text-purple-400" />
                          <span>{exp.alamat}</span>
                        </div>
                      )}

                      {/* Period */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FaCalendarAlt className="text-purple-400" />
                        <span>{exp.periode}</span>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Job Description:</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {exp.jobdesk}
                      </p>
                    </div>

                    {/* Footer Decorative */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                      <div className="flex-grow h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    </div>
                  </div>

                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summary Stats - Optional */}
      {!loading && experiences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-[#282C33] border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">{experiences.length}</p>
            <p className="text-sm text-gray-400 mt-1">Total Experience</p>
          </div>
          <div className="bg-[#282C33] border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-400">
              {experiences.filter(e => e.status?.toLowerCase() === 'active').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Active Roles</p>
          </div>
          <div className="bg-[#282C33] border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">
              {experiences.filter(e => e.status?.toLowerCase() === 'completed').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Completed</p>
          </div>
          <div className="bg-[#282C33] border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">
              {new Set(experiences.map(e => e.namaPerusahaan)).size}
            </p>
            <p className="text-sm text-gray-400 mt-1">Companies</p>
          </div>
        </motion.div>
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

export default Experience;