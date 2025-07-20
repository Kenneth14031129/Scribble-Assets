/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Menu,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";
import { getCurrentUser, logout as logoutUser } from "../services/authApi";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleLogout = async () => {
    try {
      logoutUser();

      window.history.replaceState(null, "", "/");

      navigate("/", { replace: true });

      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      logoutUser();
      navigate("/", { replace: true });
    }
  };

  const getUserDisplayName = () => {
    if (!currentUser) return "User";

    if (currentUser.firstname && currentUser.lastname) {
      return `${currentUser.firstname} ${currentUser.lastname}`;
    }

    if (currentUser.name) {
      return currentUser.name;
    }

    return currentUser.email?.split("@")[0] || "User";
  };

  const getUserEmail = () => {
    return currentUser?.email || "user@example.com";
  };

  const getProfilePictureUrl = () => {
    if (currentUser?.profilePicture) {
      return `http://localhost:5000/uploads/assets/${currentUser.profilePicture}`;
    }
    return null;
  };

  return (
    <header>
      <div className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {getProfilePictureUrl() ? (
                  <img
                    src={getProfilePictureUrl()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role || "User"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">{getUserEmail()}</p>
                  {currentUser?.role && (
                    <p className="text-xs text-blue-600 capitalize mt-1">
                      {currentUser.role}
                    </p>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
