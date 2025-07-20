import { useState, useEffect } from "react";
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
import { getCurrentUser, authenticatedFetch } from "./services/authApi";
import { useToast } from "./contexts/ToastContext";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return;

    try {
      setImageLoading(true);

      const formData = new FormData();
      formData.append("profilePicture", profileImage);

      const response = await fetch(
        "http://localhost:5000/api/auth/upload-profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }

      if (result.success) {
        showSuccess("Profile picture updated successfully");
        setProfileImage(null);
        setImagePreview(null);

        // Update localStorage
        const currentUser = getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            profilePicture: result.data.profilePicture,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserData((prev) => ({
            ...prev,
            profilePicture: result.data.profilePicture,
          }));
        }
      } else {
        showError(result.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showError(error.message || "Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  // User data state - Initialize with current user data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    role: "",
    joinDate: "",
    lastLogin: "",
    profilePicture: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const currentUser = getCurrentUser();
      if (currentUser) {
        setUserData({
          firstName: currentUser.firstname || "",
          lastName: currentUser.lastname || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          city: currentUser.city || "",
          role: currentUser.role || "",
          profilePicture: currentUser.profilePicture || "", // Add this line
          joinDate: currentUser.createdAt
            ? new Date(currentUser.createdAt).toLocaleDateString()
            : "",
          lastLogin: currentUser.lastLogin
            ? new Date(currentUser.lastLogin).toLocaleString()
            : "",
        });
      }

      const response = await authenticatedFetch("/auth/profile");
      if (response.success) {
        const user = response.data.user;
        setUserData({
          firstName: user.firstname || "",
          lastName: user.lastname || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          role: user.role || "",
          profilePicture: user.profilePicture || "", // Add this line
          joinDate: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "",
          lastLogin: user.lastLogin
            ? new Date(user.lastLogin).toLocaleString()
            : "",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      showError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData = {
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
      };

      const response = await authenticatedFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        showSuccess("Profile updated successfully");
        setIsEditing(false);

        // Update localStorage
        const currentUser = getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updateData };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserData(); // Reset to original data
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      const response = await authenticatedFetch("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.success) {
        showSuccess("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showError(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (loading && !userData.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
            <div className="relative h-32 bg-gradient-to-r from-green-800 to-green-600 rounded-t-lg">
              <div className="absolute -bottom-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : userData.profilePicture ? (
                      <img
                        src={`http://localhost:5000/uploads/assets/${userData.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Camera button - simple file input trigger */}
                  <div className="absolute bottom-2 right-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-picture-input"
                    />
                    <label
                      htmlFor="profile-picture-input"
                      className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                  </div>

                  {/* Show upload/cancel buttons when image is selected */}
                  {(profileImage || imagePreview) && (
                    <div className="absolute -bottom-20 left-0 right-0 flex justify-center space-x-2">
                      <button
                        onClick={uploadProfileImage}
                        disabled={imageLoading}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {imageLoading ? "Uploading..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setProfileImage(null);
                          setImagePreview(null);
                        }}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-gray-600 capitalize">{userData.role}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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

                    <div>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={userData.city}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserData({ ...userData, city: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
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
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save Changes"}
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
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            type="button"
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
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        disabled={
                          loading ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword
                        }
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? "Updating..." : "Update Password"}
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
