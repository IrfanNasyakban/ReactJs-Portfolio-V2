import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";
import {
  FaCertificate,
  FaSave,
  FaTimes,
  FaImage,
  FaLink,
  FaFileAlt,
  FaUpload,
  FaSpinner,
  FaExchangeAlt,
} from "react-icons/fa";

const EditCertificate = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    link: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

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
      getCertificateById();
    } else {
      navigate("/");
    }
  }, [navigate, user]);

  const getCertificateById = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;

      const response = await axios.get(`${apiUrl}/certificate/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setFormData({
          judul: response.data.judul || "",
          deskripsi: response.data.deskripsi || "",
          link: response.data.link || "",
          image: null,
        });
        if (response.data.url) {
          setExistingImage(response.data.url);
          setPreview(response.data.url);
        }
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      alert("Failed to load certificate data");
      navigate("/certificates");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, JPEG, PNG, and GIF files are allowed",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setPreview(existingImage);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = "Title is required";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;

      const formDataToSend = new FormData();
      formDataToSend.append("judul", formData.judul);
      formDataToSend.append("deskripsi", formData.deskripsi);
      formDataToSend.append("link", formData.link);

      // Only append file if a new one was selected
      if (formData.image) {
        formDataToSend.append("file", formData.image);
      }

      await axios.patch(`${apiUrl}/certificate/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/certificates");
    } catch (error) {
      console.error("Error updating certificate:", error);
      alert(error.response?.data?.message || "Failed to update certificate");
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <FaSpinner
            className="animate-spin text-6xl mx-auto mb-4"
            style={{ color: safeColor }}
          />
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading certificate data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Background Decorations */}
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

      <div className="max-w-7xl mx-auto relative z-10">
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
              <FaCertificate className="text-white text-2xl" />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Edit Certificate
              </h1>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Update your certification information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            <div
              className={`rounded-xl border p-8 ${isDark ? "bg-[#282C33] border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="space-y-6">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaCertificate
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                      Certificate Title
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    } outline-none focus:border-purple-500 ${
                      errors.judul ? "border-red-500" : ""
                    }`}
                  />
                  {errors.judul && (
                    <p className="mt-1 text-sm text-red-500">{errors.judul}</p>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileAlt
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                      Description
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Describe what you learned or achieved..."
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    } outline-none focus:border-purple-500 ${
                      errors.deskripsi ? "border-red-500" : ""
                    }`}
                  />
                  {errors.deskripsi && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.deskripsi}
                    </p>
                  )}
                </motion.div>

                {/* Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaLink
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                      Certificate Link (Optional)
                    </div>
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com/certificate"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                    } outline-none focus:border-purple-500`}
                  />
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Link to verify or view the certificate online
                  </p>
                </motion.div>

                {/* Image Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaImage
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                      Certificate Image
                    </div>
                  </label>

                  {preview ? (
                    <div className="space-y-3">
                      {/* Image Preview */}
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      {/* Status Text */}
                      {formData.image ? (
                        <div
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          ✓ New image selected - This will replace the current
                          image
                        </div>
                      ) : (
                        <div
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Current image - Upload a new one to replace it
                        </div>
                      )}

                      {/* Change Image Button */}
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                          isDark
                            ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <FaExchangeAlt />
                        <span className="font-medium">
                          {formData.image
                            ? "Choose Different Image"
                            : "Upload New Image"}
                        </span>
                      </button>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      } ${errors.image ? "border-red-500" : ""}`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload
                          className={`text-4xl mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        />
                        <p
                          className={`mb-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p
                          className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                        >
                          PNG, JPG, JPEG or GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  )}
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 mt-8 pt-6 border-t"
                style={{ borderColor: isDark ? "#374151" : "#E5E7EB" }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: safeColor }}
                >
                  <FaSave />
                  <span>{loading ? "Updating..." : "Update Certificate"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/certificates")}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
                    isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </motion.div>
            </div>
          </form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`mt-6 p-4 rounded-lg border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-blue-50 border-blue-200"}`}
          >
            <p
              className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              <strong>Tip:</strong> You can update the certificate information
              without changing the image. To replace the image, click "Upload
              New Image" button or drag and drop a new file.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditCertificate;