import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Package,
} from "lucide-react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import ViewDetails from "./Equipments/ViewDetails";
import EditAsset from "./Equipments/EditAsset";
import { fetchDisposedAssets } from "./services/api";
import { useToast } from "./contexts/ToastContext";

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `http://localhost:5000${imagePath}`;
};

const Disposed = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const itemsPerPage = 4;

  const categories = [
    "Medical Equipment",
    "Therapy Tools",
    "Furniture",
    "Supplies",
  ];

  const conditions = [
    { value: "excellent", label: "Excellent", color: "green" },
    { value: "good", label: "Good", color: "blue" },
    { value: "fair", label: "Fair", color: "yellow" },
    { value: "poor", label: "Poor", color: "red" },
    { value: "out-of-service", label: "Out of Service", color: "gray" },
  ];

  useEffect(() => {
    loadDisposedAssets();
  }, []);

  const loadDisposedAssets = async () => {
    try {
      setLoading(true);
      // Remove setError(null); since we're using toasts now
      const assets = await fetchDisposedAssets();

      // Transform the data to match your existing format
      const transformedAssets = assets.map((asset) => ({
        id: asset._id,
        name: asset.name,
        serialNumber: asset.serialNumber,
        category: getCategoryLabel(asset.category),
        condition: asset.condition,
        purchaseDate: asset.purchaseDate
          ? new Date(asset.purchaseDate).toISOString().split("T")[0]
          : "",
        purchasePrice: asset.purchasePrice || 0,
        image: asset.image,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      }));

      setAllAssets(transformedAssets);
    } catch (err) {
      console.error("Error loading disposed assets:", err);
      showError("Failed to load disposed assets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add this helper function
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

  // Filter and sort assets
  const filteredAssets = allAssets
    .filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || asset.category === filterCategory;
      const matchesCondition =
        !filterCondition || asset.condition === filterCondition;

      return matchesSearch && matchesCategory && matchesCondition;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "purchasePrice") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getConditionColor = (condition) => {
    const conditionObj = conditions.find((c) => c.value === condition);
    return conditionObj ? conditionObj.color : "gray";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterCondition("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="Disposed Assets"
      />

      <div className="lg:ml-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Disposed Assets"
        />

        <main className="p-3 sm:p-4 lg:p-6">
          {/* Header Section */}
          <div className="mb-4 lg:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Disposed Assets
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage and track all out of service assets
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button className="flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm mb-4 lg:mb-6">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search disposed assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Conditions</option>
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assets List */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Disposed Assets ({filteredAssets.length})
                </h3>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Asset Name
                        {sortBy === "name" && (
                          <ChevronDown
                            className={`w-4 h-4 ml-1 ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>

                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAssets.map((asset) => {
                    return (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              {asset.image ? (
                                <img
                                  src={getImageUrl(asset.image)}
                                  alt={asset.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to Package icon if image fails to load
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <Package
                                className={`w-5 h-5 text-blue-600 ${
                                  asset.image ? "hidden" : "block"
                                }`}
                                style={asset.image ? { display: "none" } : {}}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {asset.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {asset.subcategory}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900 font-mono">
                          {asset.serialNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900">
                          {asset.category}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getConditionColor(asset.condition) === "green"
                                ? "bg-green-100 text-green-800"
                                : getConditionColor(asset.condition) === "blue"
                                ? "bg-blue-100 text-blue-800"
                                : getConditionColor(asset.condition) ===
                                  "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : getConditionColor(asset.condition) === "red"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {
                              conditions.find(
                                (c) => c.value === asset.condition
                              )?.label
                            }
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowActionMenu(
                                  showActionMenu === asset.id ? null : asset.id
                                )
                              }
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {showActionMenu === asset.id && (
                              <div
                                className={`absolute right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 ${
                                  paginatedAssets.indexOf(asset) >=
                                  paginatedAssets.length - 2
                                    ? "bottom-full mb-1"
                                    : "top-full mt-1"
                                }`}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setSelectedAsset(asset);
                                      setShowViewModal(true);
                                      setShowActionMenu(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Eye className="w-4 h-4 mr-3" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedAsset(asset);
                                      setShowEditModal(true);
                                      setShowActionMenu(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <Edit2 className="w-4 h-4 mr-3" />
                                    Edit Asset
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {paginatedAssets.map((asset) => {
                return (
                  <div
                    key={asset.id}
                    className="p-3 sm:p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {asset.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500 font-mono">
                            {asset.serialNumber}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs text-gray-600">
                              {asset.category}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                getConditionColor(asset.condition) === "green"
                                  ? "bg-green-100 text-green-800"
                                  : getConditionColor(asset.condition) ===
                                    "blue"
                                  ? "bg-blue-100 text-blue-800"
                                  : getConditionColor(asset.condition) ===
                                    "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : getConditionColor(asset.condition) === "red"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {
                                conditions.find(
                                  (c) => c.value === asset.condition
                                )?.label
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative ml-2">
                        <button
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === asset.id ? null : asset.id
                            )
                          }
                          className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {showActionMenu === asset.id && (
                          <div
                            className={`absolute right-0 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-10 ${
                              paginatedAssets.indexOf(asset) >=
                              paginatedAssets.length - 2
                                ? "bottom-full mb-1"
                                : "top-full mt-1"
                            }`}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedAsset(asset);
                                  setShowViewModal(true);
                                  setShowActionMenu(null);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAsset(asset);
                                  setShowEditModal(true);
                                  setShowActionMenu(null);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit2 className="w-4 h-4 mr-3" />
                                Edit Asset
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredAssets.length)}{" "}
                    of {filteredAssets.length} disposed assets
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Mobile: Show only current page */}
                    <div className="sm:hidden">
                      <span className="px-2 py-1 text-sm font-medium text-gray-700">
                        {currentPage} / {totalPages}
                      </span>
                    </div>

                    {/* Desktop: Show page numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-lg ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredAssets.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
              <XCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No disposed assets found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                {searchTerm || filterCategory || filterCondition
                  ? "Try adjusting your search or filter criteria."
                  : "No assets are currently out of service."}
              </p>
            </div>
          )}
        </main>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading disposed assets...</p>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedAsset && (
        <ViewDetails
          asset={selectedAsset}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAsset(null);
          }}
          onEdit={(asset) => {
            setShowViewModal(false);
            setSelectedAsset(asset);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Edit Asset Modal */}
      {showEditModal && selectedAsset && (
        <EditAsset
          asset={selectedAsset}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAsset(null);
          }}
          onSave={(updatedAsset) => {
            console.log("Updated asset data:", updatedAsset);
            setShowEditModal(false);
            setSelectedAsset(null);
            loadDisposedAssets();
            showSuccess("Disposed asset updated successfully!");
          }}
        />
      )}
    </div>
  );
};

export default Disposed;
