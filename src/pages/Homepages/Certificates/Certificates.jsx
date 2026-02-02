import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import { FiExternalLink, FiGithub } from "react-icons/fi";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getCertificates();
  }, []);

  const getCertificates = async () => {
    try {
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/all-certificate`);
      const sortedCertificates = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setCertificates(sortedCertificates);
    } catch (error) {
      console.error("Error fetching Certificates:", error);
    } finally {
      console.log("done");
    }
  };

  return (
    <div id="certificates" className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-purple-500">#</span>certificates
          </h2>
          <div className="h-[1px] bg-purple-500 flex-grow max-w-[500px]"></div>
        </div>
        <button
          onClick={() => navigate("/certificates-page")}
          className="text-white hover:text-purple-500 transition-colors flex items-center gap-2 group"
        >
          View all
          <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No certificates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => {
            const hasLiveLink =
              certificate.link &&
              certificate.link !== "-" &&
              certificate.link !== "";
            const hasGithubLink =
              certificate.github &&
              certificate.github !== "-" &&
              certificate.github !== "";

            return (
              <div
                key={certificate.id}
                className="border border-slate-600 hover:border-purple-500 transition-all duration-300 group"
              >
                {/* Certificate Image */}
                <div className="h-52 overflow-hidden bg-slate-800">
                  <img
                    src={certificate.url}
                    alt={certificate.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 bg-[#282C33]">
                  <h3 className="text-xl font-semibold text-white">
                    {certificate.judul}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {certificate.deskripsi}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    {/* Live Link Button */}
                    {hasLiveLink && (
                      <a
                        href={certificate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border border-purple-500 text-white hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2"
                      >
                        Verification
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Show message if no links available */}
                    {!hasLiveLink && !hasGithubLink && (
                      <span className="text-slate-500 text-sm italic py-2">
                        No links available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

export default Certificates;
