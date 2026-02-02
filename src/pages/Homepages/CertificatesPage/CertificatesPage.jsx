import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiExternalLink, FiArrowLeft, FiAward } from "react-icons/fi";
import { FaFilter, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCertificates();
  }, []);

  const getCertificates = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/all-certificate`);
      setCertificates(response.data || []);
    } catch (error) {
      console.error("Error fetching Certificates:", error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1e1e2e] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FiAward className="text-purple-400 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                All <span className="text-purple-500">Certificates</span>
              </h1>
              <p className="text-gray-400 mt-1">
                My professional certifications and achievements
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-grow relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#282C33] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FiAward className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm ? "No certificates found matching your search" : "No certificates found"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate, index) => {
              const hasLiveLink =
                certificate.link &&
                certificate.link !== "-" &&
                certificate.link !== "";

              return (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="bg-[#282C33] border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col">
                    {/* Certificate Image */}
                    <div className="relative h-52 overflow-hidden bg-gray-800">
                      <img
                        src={certificate.url}
                        alt={certificate.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop";
                        }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                          {certificate.judul}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {certificate.deskripsi}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-700">
                        {hasLiveLink ? (
                          <a
                            href={certificate.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 group/btn"
                          >
                            <span className="font-medium">View Certificate</span>
                            <FiExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                            <span>No verification link</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-lg pointer-events-none transition-colors duration-300"></div>
                  </div>

                  {/* Floating Decorative Element */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>

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

export default CertificatesPage;