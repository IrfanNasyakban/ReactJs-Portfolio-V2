import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import { useStateContext } from '../contexts/ContextProvider';
import {
  FaProjectDiagram,
  FaSave,
  FaTimes,
  FaImage,
  FaUpload,
  FaSpinner,
  FaLink,
  FaGithub,
  FaTags,
  FaCode
} from 'react-icons/fa';

const AddProject = () => {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tags, setTags] = useState('');
  const [techStack, setTechStack] = useState('');
  const [link, setLink] = useState('');
  const [github, setGithub] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode } = useStateContext();

  const safeColor = currentColor || '#A855F7';
  const isDark = currentMode === 'Dark';

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate, user]);

  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (PNG, JPG, or JPEG)'
        }));
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should not exceed 5MB'
        }));
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!judul.trim()) newErrors.judul = 'Project title is required';
    if (!deskripsi.trim()) newErrors.deskripsi = 'Description is required';
    if (!tags.trim()) newErrors.tags = 'Tags are required';
    if (!techStack.trim()) newErrors.techStack = 'Tech stack is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('tags', tags);
    formData.append('techStack', techStack);
    formData.append('link', link);
    formData.append('github', github);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.REACT_APP_URL_API;

      await axios.post(`${apiUrl}/project`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response?.data?.msg) {
        setErrors({ submit: error.response.data.msg });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Failed to create project. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: safeColor }}>
              <FaProjectDiagram className="text-white text-2xl" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Add New Project
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Create a new project for your portfolio
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <form onSubmit={saveProject}>
            <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#282C33] border-gray-700' : 'bg-white border-gray-200'}`}>
              {errors.submit && (
                <div className="mb-6 p-4 rounded-lg border border-red-500" style={{ backgroundColor: getColorWithOpacity('#EF4444', 0.1) }}>
                  <p className="text-red-500 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Image Upload */}
              <div className="mb-8">
                <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Image <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className={`w-40 h-40 rounded-xl overflow-hidden border-2 flex items-center justify-center ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="text-4xl" style={{ color: getColorWithOpacity(safeColor, 0.5) }} />
                    )}
                  </div>

                  <div className="flex-1">
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <div className="flex gap-3">
                      <label htmlFor="image" className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}>
                        <FaUpload />
                        <span>Upload Image</span>
                      </label>
                      {preview && (
                        <button type="button" onClick={removeImage} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300">
                          <FaTimes />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      JPG, PNG or JPEG. Max size 5MB.
                    </p>
                    {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Project Title */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaProjectDiagram className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <input
                      type="text"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                      placeholder="Enter project title"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        errors.judul ? 'border-red-500' : isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500'
                      } outline-none`}
                    />
                  </div>
                  {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Describe your project..."
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      errors.deskripsi ? 'border-red-500' : isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                        : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500'
                    } outline-none`}
                  />
                  {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                </div>

                {/* Tags */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tags <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaTags className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., Web App, Mobile"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        errors.tags ? 'border-red-500' : isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500'
                      } outline-none`}
                    />
                  </div>
                  {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                </div>

                {/* Tech Stack */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tech Stack <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaCode className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <input
                      type="text"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="e.g., React, Node.js, MongoDB"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        errors.techStack ? 'border-red-500' : isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500'
                      } outline-none`}
                    />
                  </div>
                  {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>}
                </div>

                {/* Live Link */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Live Link
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaLink className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500'
                      } outline-none`}
                    />
                  </div>
                </div>

                {/* GitHub Link */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    GitHub Repository
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaGithub className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-800 focus:border-purple-500'
                      } outline-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: safeColor }}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Create Project</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-300 border-2 ${
                    isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;