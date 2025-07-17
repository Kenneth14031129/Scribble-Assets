import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Plus,
  Wrench,
} from "lucide-react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data
  const stats = [
    {
      title: "Total Assets",
      value: "1,247",
      trending: "up",
      icon: Package,
      color: "blue",
    },
    {
      title: "Available",
      value: "892",
      trending: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "In Use",
      value: "298",
      trending: "up",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Maintenance",
      value: "57",
      trending: "down",
      icon: Wrench,
      color: "red",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Added new equipment",
      item: "Ultrasound Machine - Model X200",
      user: "Dr. Sarah Johnson",
      time: "2 hours ago",
      type: "add",
    },
    {
      id: 2,
      action: "Maintenance completed",
      item: "Physical Therapy Table #12",
      user: "Maintenance Team",
      time: "4 hours ago",
      type: "maintenance",
    },
    {
      id: 3,
      action: "Asset transferred",
      item: "Wheelchair - Standard",
      user: "Nurse Emily Chen",
      time: "6 hours ago",
      type: "transfer",
    },
    {
      id: 4,
      action: "Low stock alert",
      item: "Disposable Gloves",
      user: "System",
      time: "1 day ago",
      type: "alert",
    },
  ];

  const assetCategories = [
    { name: "Medical Equipment", count: 456, color: "blue" },
    { name: "Therapy Tools", count: 289, color: "green" },
    { name: "Furniture", count: 234, color: "yellow" },
    { name: "IT Equipment", count: 178, color: "purple" },
    { name: "Supplies", count: 90, color: "red" },
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
    };
    return colors[color] || "bg-gray-500";
  };

  const getStatBgColor = (color) => {
    const colors = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      yellow: "bg-yellow-50",
      red: "bg-red-50",
      purple: "bg-purple-50",
    };
    return colors[color] || "bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="Dashboard"
      />

      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} title="Dashboard" />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatBgColor(
                      stat.color
                    )}`}
                  >
                    <stat.icon className={`w-6 h-6 text-black`} />
                    <div
                      className={`absolute w-12 h-12 rounded-full ${getStatColor(
                        stat.color
                      )} opacity-20`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Asset Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Asset Categories
              </h3>
              <div className="space-y-4">
                {assetCategories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatColor(
                          category.color
                        )} mr-3`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities - spans 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activities
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "add"
                              ? "bg-green-100"
                              : activity.type === "maintenance"
                              ? "bg-blue-100"
                              : activity.type === "transfer"
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          {activity.type === "add" ? (
                            <Plus className="w-4 h-4 text-green-600" />
                          ) : activity.type === "maintenance" ? (
                            <Wrench className="w-4 h-4 text-blue-600" />
                          ) : activity.type === "transfer" ? (
                            <Package className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.item}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{activity.user}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
