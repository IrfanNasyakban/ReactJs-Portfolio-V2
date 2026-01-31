import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaCalendarAlt, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEducations();
  }, []);

  const getEducations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL_API || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/all-education`);
      setEducations(response.data || []);
    } catch (error) {
      console.error('Error fetching educations:', error);
      setEducations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id='education' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-purple-500">#</span>education
          </h2>
          <div className="h-[1px] bg-purple-500 flex-grow max-w-[500px]"></div>
        </div>
      </div>

      {/* Education Timeline */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : educations.length === 0 ? (
        <div className="text-center py-20">
          <FaGraduationCap className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No education data available</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-transparent"></div>

          {/* Education Items */}
          <div className="space-y-12">
            {educations.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#1e1e2e] z-10">
                  <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75"></div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="group bg-[#282C33] border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="p-6">
                      {/* Header with Logo and Period */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700 border border-gray-600">
                          {edu.url ? (
                            <img
                              src={edu.url}
                              alt={edu.instansi}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full items-center justify-center ${edu.url ? 'hidden' : 'flex'}`}>
                            <FaGraduationCap className="text-purple-500 text-2xl" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                            {edu.instansi}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <FaBook className="text-xs" />
                            <span>{edu.bagian}</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-400 text-sm">
                            <FaCalendarAlt className="text-xs" />
                            <span className="font-medium">{edu.periode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Decorative Border */}
                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {index === 0 && <span className="text-purple-400 font-medium">Latest</span>}
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Gradient */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

export default Education;