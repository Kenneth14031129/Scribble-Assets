import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Heart,
  Shield,
  BarChart3,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "admin@therapy.com",
    password: "Admin12345",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login attempted with:", formData);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Information - Hidden on mobile/tablet */}
          <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 to-blue-700 p-12 flex-col justify-center text-white relative min-h-[600px]">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">Therapy Center</h1>
              <h2 className="text-2xl font-light mb-8 text-blue-100">
                Asset Management System
              </h2>

              <p className="text-lg mb-12 text-blue-100 leading-relaxed">
                Streamline your therapy center's asset tracking and management
                with our comprehensive digital solution.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base">
                      Secure & Reliable
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Enterprise-grade security for your data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full flex-shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base">
                      Real-time Tracking
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Monitor assets and inventory in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base">
                      Team Collaboration
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Seamless workflow management
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          </div>

          {/* Divider Line - Hidden on mobile/tablet */}
          <div className="hidden lg:block w-px bg-gray-200"></div>

          {/* Right Side - Login Form */}
          <div className="flex-1 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              {/* Mobile Header - Only shown on mobile/tablet */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Therapy Center
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Asset Management System
                </p>
              </div>

              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Please sign in to access your account
                </p>
              </div>

              <div className="space-y-5 md:space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-9 md:pl-10 pr-3 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-9 md:pl-10 pr-9 md:pr-10 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white py-2.5 md:py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </button>
              </div>

              {/* Additional Links */}
              <div className="mt-6 md:mt-8 text-center">
                <p className="text-xs md:text-sm text-gray-600">
                  Forgot your email or password?{" "}
                  <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Contact Administrator
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
