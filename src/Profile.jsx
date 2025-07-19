import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Key,
  Clock,
} from "lucide-react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);

  // User data state
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "admin@scribble.com",
    phone: "+63 (555) 123-4567",
    address: "123 Medical Center Dr",
    city: "San Francisco",
    role: "System Administrator",
    joinDate: "2022-01-15",
    lastLogin: "2024-07-19 09:30 AM",
  });

  const handleSave = () => {
    // Save logic here
    console.log("Saving profile data:", userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="Profile"
      />

      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} title="Profile" />

        <main className="p-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
              <div className="absolute -bottom-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-600" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-gray-600">{userData.role}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userData.firstName}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userData.lastName}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({ ...userData, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={userData.email}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={userData.phone}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={userData.address}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              address: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Join Date
                          </p>
                          <p className="text-sm text-gray-500">
                            {userData.joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Last Login
                          </p>
                          <p className="text-sm text-gray-500">
                            {userData.lastLogin}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
