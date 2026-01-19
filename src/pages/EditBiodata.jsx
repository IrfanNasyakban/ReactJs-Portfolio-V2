import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { motion } from "framer-motion";

import { useStateContext } from "../contexts/ContextProvider";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
  FaCalendar,
  FaVenusMars,
  FaImage,
  FaUpload,
  FaSpinner,
} from "react-icons/fa";

const EditBiodata = () => {
  const [nama, setNama] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentColor, currentMode } = useStateContext();

  const safeColor = currentColor || "#A855F7";
  const isDark = currentMode === "Dark";

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getBiodataById();
    } else {
      navigate("/");
    }
  }, [navigate, user]);

  // Helper function for colors with opacity
  const getColorWithOpacity = (color, opacity) => {
    if (!color) return `rgba(168, 85, 247, ${opacity})`;
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getBiodataById = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/biodata/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setNama(data.nama || "");
      setGender(data.gender || "");
      setEmail(data.email || "");
      setTglLahir(data.tglLahir || "");
      setNoHp(data.noHp || "");
      setAlamat(data.alamat || "");
      setPreview(data.url || null);
    } catch (error) {
      console.error("Error fetching siswa data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBiodata = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!nama.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }
    if (!email.trim()) {
      setError("Email tidak boleh kosong");
      return;
    }
    if (!alamat.trim()) {
      setError("Alamat tidak boleh kosong");
      return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("tglLahir", tglLahir);
    formData.append("noHp", noHp);
    formData.append("alamat", alamat);
    if (file) {
      formData.append("file", file);
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.patch(`${apiUrl}/biodata/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/biodata");
      setSuccess("Data biodata berhasil diperbarui!");

    } catch (error) {
      console.error("Error updating biodata:", error);
      if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else {
        setError("Gagal memperbarui data biodata");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (PNG, JPG, or JPEG)'
        }));
        return;
      }

      // Validate file size (max 5MB to match backend)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should not exceed 5MB'
        }));
        return;
      }

      // Set file
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  // Remove image
  const removeImage = () => {
    setFile(null);
    setPreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div
              key={`top-${i}`}
              className="w-1 h-1"
              style={{ backgroundColor: safeColor }}
            ></div>
          ))}
        </div>
        <div className="absolute bottom-20 right-20 grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div
              key={`bottom-${i}`}
              className="w-1 h-1"
              style={{ backgroundColor: safeColor }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: safeColor }}
            >
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Create Biodata
              </h1>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Fill in your personal information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={updateBiodata}>
            <div
              className={`p-8 rounded-xl border ${
                isDark
                  ? "bg-[#282C33] border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Error Message */}
              {error.submit && (
                <div
                  className="mb-6 p-4 rounded-lg border border-red-500"
                  style={{
                    backgroundColor: getColorWithOpacity("#EF4444", 0.1),
                  }}
                >
                  <p className="text-red-500 text-sm">{error.submit}</p>
                </div>
              )}

              {/* Image Upload */}
              <div className="mb-8">
                <label
                  className={`block text-sm font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Profile Photo <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Preview */}
                  <div
                    className={`w-40 h-40 rounded-xl overflow-hidden border-2 flex items-center justify-center ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaImage
                        className="text-4xl"
                        style={{ color: getColorWithOpacity(safeColor, 0.5) }}
                      />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <div className="flex gap-3">
                      <label
                        htmlFor="image"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                          isDark
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        <FaUpload />
                        <span>Upload Photo</span>
                      </label>

                      {preview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
                        >
                          <FaTimes />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <p
                      className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      JPG, PNG or JPEG. Max size 5MB.
                    </p>

                    {error.image && (
                      <p className="text-red-500 text-sm mt-2">
                        {error.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaUser
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="text"
                      name="nama"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        error.nama
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
                      } outline-none`}
                    />
                  </div>
                  {error.nama && (
                    <p className="text-red-500 text-sm mt-1">{error.nama}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaVenusMars
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <select
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        error.gender
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
                      } outline-none`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {error.gender && (
                    <p className="text-red-500 text-sm mt-1">{error.gender}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaEnvelope
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        error.email
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
                      } outline-none`}
                    />
                  </div>
                  {error.email && (
                    <p className="text-red-500 text-sm mt-1">{error.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaPhone
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="tel"
                      name="noHp"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      placeholder="+62 812 3456 7890"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        error.noHp
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
                      } outline-none`}
                    />
                  </div>
                  {error.noHp && (
                    <p className="text-red-500 text-sm mt-1">{error.noHp}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FaCalendar
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="date"
                      name="tglLahir"
                      value={tglLahir ? new Date(tglLahir).toISOString().split('T')[0] : ''}
                      onChange={(e) => setTglLahir(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                        error.tglLahir
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
                      } outline-none`}
                    />
                  </div>
                  {error.tglLahir && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.tglLahir}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3">
                      <FaMapMarkerAlt
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <textarea
                      name="alamat"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Enter your complete address"
                      rows="4"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors resize-none ${
                        error.alamat
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                            : "bg-white border-gray-300 text-gray-800 focus:border-purple-500"
                      } outline-none`}
                    />
                  </div>
                  {error.alamat && (
                    <p className="text-red-500 text-sm mt-1">{error.alamat}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t"
                style={{ borderColor: isDark ? "#374151" : "#E5E7EB" }}
              >
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
                      <span>Update Biodata</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/biodata")}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-300 border-2 ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
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

export default EditBiodata;
