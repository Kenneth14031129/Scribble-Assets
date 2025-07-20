import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Package, AlertCircle } from "lucide-react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { fetchAssets } from "./services/api";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    available: 0,
    outOfService: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const assets = await fetchAssets();

      // Calculate statistics
      const totalAssets = assets.length;
      const available = assets.filter(
        (asset) => asset.condition !== "out-of-service"
      ).length;
      const outOfService = assets.filter(
        (asset) => asset.condition === "out-of-service"
      ).length;

      // Calculate categories
      const categoryMap = {};
      assets.forEach((asset) => {
        const category = getCategoryLabel(asset.category);
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });

      const categories = Object.entries(categoryMap).map(
        ([name, count], index) => ({
          name,
          count,
          color: ["blue", "green", "yellow", "red", "purple"][index] || "gray",
        })
      );

      setDashboardData({
        totalAssets,
        available,
        outOfService,
        categories,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      medical: "Medical Equipment",
      therapy: "Therapy Tools",
      furniture: "Furniture",
      supplies: "Supplies",
      other: "Other",
    };
    return categoryMap[category] || category;
  };

  const stats = [
    {
      title: "Total Assets",
      value: dashboardData.totalAssets.toLocaleString(),
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Available",
      value: dashboardData.available.toLocaleString(),
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Out of Service",
      value: dashboardData.outOfService.toLocaleString(),
      icon: AlertTriangle,
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  const getCategoryColor = (color) => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
    };
    return colors[color] || "bg-gray-500";
  };

  // Loading State Component
  const LoadingState = () => (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadDashboardData}
          className="ml-auto px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="Dashboard"
      />

      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} title="Dashboard" />

        <main className="p-6 max-w-7xl mx-auto">
          {error && <ErrorState />}

          {loading ? (
            <LoadingState />
          ) : (
            <div className="space-y-8">
              {/* Stats Cards - Improved spacing and layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className={`bg-white rounded-xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Asset Categories - Improved design */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Asset Categories
                  </h3>
                  <span className="text-sm text-gray-500">
                    {dashboardData.categories.length} categories
                  </span>
                </div>

                {dashboardData.categories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.categories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full ${getCategoryColor(
                              category.color
                            )} mr-3 flex-shrink-0`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-md">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No asset categories found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
