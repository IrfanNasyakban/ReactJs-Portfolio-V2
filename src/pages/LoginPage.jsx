import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";

import { HiEye, HiEyeOff, HiUser, HiLockClosed } from "react-icons/hi";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    // Reset state only if login was attempted
    if (isError) {
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, isSuccess, isError, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  };

  return (
    <div className="min-h-screen bg-[#282C33] relative overflow-hidden flex items-center justify-center px-6">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 grid grid-cols-5 gap-2 opacity-40">
        {[...Array(25)].map((_, i) => (
          <div key={`top-left-${i}`} className="w-1 h-1 bg-slate-500"></div>
        ))}
      </div>

      <div className="absolute top-20 right-20 w-32 h-32 border border-slate-500 opacity-40"></div>

      <div className="absolute bottom-20 left-20 w-24 h-24 border border-purple-500 opacity-60"></div>

      <div className="absolute bottom-10 right-10 grid grid-cols-5 gap-2 opacity-40">
        {[...Array(25)].map((_, i) => (
          <div key={`bottom-right-${i}`} className="w-1 h-1 bg-slate-500"></div>
        ))}
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome <span className="text-purple-500">Back</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Please login to your account
          </p>
        </div>

        {/* Login Box */}
        <div className="border border-slate-500 bg-[#282C33] p-8">
          {/* Error/Success Message */}
          {isError && (
            <div className="mb-6 p-4 border border-red-500 bg-red-500/10">
              <p className="text-red-400 text-sm">{message}</p>
            </div>
          )}
          
          {isSuccess && (
            <div className="mb-6 p-4 border border-green-500 bg-green-500/10">
              <p className="text-green-400 text-sm">Login successful!</p>
            </div>
          )}
          <form onSubmit={Auth}>
            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <HiUser className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-[#1E2128] border border-slate-600 focus:border-purple-500 text-white px-10 py-3 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <HiLockClosed className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#1E2128] border border-slate-600 focus:border-purple-500 text-white px-10 py-3 outline-none transition-colors"
                    required
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeOff className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white font-medium py-3 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;