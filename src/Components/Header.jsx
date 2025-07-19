import React, { useState } from "react";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  ChevronDown,
  LogOut,
  UserCircle,
  HelpCircle,
} from "lucide-react";

const Header = ({ onMenuClick = "Dashboard" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
    // In a real app, you'd clear tokens, redirect to login, etc.
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
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-300">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@therapy.com</p>
                </div>
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <UserCircle className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <div className="border-t border-gray-300 mt-1 pt-1">
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
