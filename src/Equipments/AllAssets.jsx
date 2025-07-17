import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Package,
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
} from "lucide-react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import AddAsset from "./AddAsset";

const AllAssets = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const itemsPerPage = 10;

  // Sample asset data
  const allAssets = [
    {
      id: 1,
      name: "Ultrasound Machine X200",
      serialNumber: "USM-2024-001",
      category: "Medical Equipment",
      subcategory: "Diagnostic",
      condition: "excellent",
      location: "Examination Room 1",
      department: "Physical Therapy",
      assignedTo: "Dr. Sarah Johnson",
      purchaseDate: "2024-01-15",
      purchasePrice: 45000,
      supplier: "MedTech Solutions",
      warrantyExpiry: "2027-01-15",
      lastMaintenance: "2024-06-15",
      nextMaintenance: "2024-12-15",
      status: "available",
      tags: ["diagnostic", "portable", "high-priority"],
    },
    {
      id: 2,
      name: "Physical Therapy Table #12",
      serialNumber: "PTT-2023-012",
      category: "Therapy Tools",
      subcategory: "Physical Therapy",
      condition: "good",
      location: "Physical Therapy Room 1",
      department: "Physical Therapy",
      assignedTo: "Therapist Mike Chen",
      purchaseDate: "2023-08-20",
      purchasePrice: 2800,
      supplier: "TherapyPro Equipment",
      warrantyExpiry: "2025-08-20",
      lastMaintenance: "2024-05-10",
      nextMaintenance: "2024-11-10",
      status: "in-use",
      tags: ["therapy", "adjustable"],
    },
    {
      id: 3,
      name: "Wheelchair - Standard",
      serialNumber: "WC-2024-008",
      category: "Therapy Tools",
      subcategory: "Mobility",
      condition: "excellent",
      location: "Storage Room",
      department: "Administration",
      assignedTo: null,
      purchaseDate: "2024-03-10",
      purchasePrice: 350,
      supplier: "Mobility Solutions Inc",
      warrantyExpiry: "2026-03-10",
      lastMaintenance: "2024-07-01",
      nextMaintenance: "2025-01-01",
      status: "available",
      tags: ["mobility", "standard"],
    },
    {
      id: 4,
      name: "Computer Workstation #5",
      serialNumber: "CWS-2022-005",
      category: "IT Equipment",
      subcategory: "Computers",
      condition: "fair",
      location: "Reception Area",
      department: "Administration",
      assignedTo: "Receptionist Anna Lee",
      purchaseDate: "2022-11-30",
      purchasePrice: 1200,
      supplier: "TechCorp",
      warrantyExpiry: "2024-11-30",
      lastMaintenance: "2024-06-20",
      nextMaintenance: "2024-12-20",
      status: "in-use",
      tags: ["computer", "reception"],
    },
    {
      id: 5,
      name: "Exercise Bike Pro",
      serialNumber: "EBP-2024-003",
      category: "Therapy Tools",
      subcategory: "Physical Therapy",
      condition: "poor",
      location: "Physical Therapy Room 2",
      department: "Physical Therapy",
      assignedTo: "Therapist Lisa Wong",
      purchaseDate: "2024-02-14",
      purchasePrice: 3500,
      supplier: "FitnessPro Medical",
      warrantyExpiry: "2027-02-14",
      lastMaintenance: "2024-04-15",
      nextMaintenance: "2024-08-15",
      status: "maintenance",
      tags: ["exercise", "cardio", "needs-repair"],
    },
    {
      id: 6,
      name: "Disposable Gloves Supply",
      serialNumber: "DGS-2024-010",
      category: "Supplies",
      subcategory: "Safety Equipment",
      condition: "excellent",
      location: "Storage Room",
      department: "Administration",
      assignedTo: null,
      purchaseDate: "2024-07-01",
      purchasePrice: 150,
      supplier: "SafeSupply Co",
      warrantyExpiry: null,
      lastMaintenance: null,
      nextMaintenance: null,
      status: "available",
      tags: ["consumable", "safety", "low-stock"],
    },
  ];

  const categories = [
    "Medical Equipment",
    "Therapy Tools",
    "Furniture",
    "IT Equipment",
    "Supplies",
  ];

  const conditions = [
    { value: "excellent", label: "Excellent", color: "green" },
    { value: "good", label: "Good", color: "blue" },
    { value: "fair", label: "Fair", color: "yellow" },
    { value: "poor", label: "Poor", color: "red" },
    { value: "out-of-service", label: "Out of Service", color: "gray" },
  ];

  const locations = [
    "Reception Area",
    "Waiting Room",
    "Physical Therapy Room 1",
    "Physical Therapy Room 2",
    "Examination Room 1",
    "Examination Room 2",
    "Storage Room",
    "Office",
  ];

  const statusOptions = [
    {
      value: "available",
      label: "Available",
      color: "green",
      icon: CheckCircle,
    },
    { value: "in-use", label: "In Use", color: "blue", icon: Clock },
    { value: "maintenance", label: "Maintenance", color: "red", icon: Wrench },
    {
      value: "out-of-service",
      label: "Out of Service",
      color: "gray",
      icon: XCircle,
    },
  ];

  // Filter and sort assets
  const filteredAssets = allAssets
    .filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || asset.category === filterCategory;
      const matchesCondition =
        !filterCondition || asset.condition === filterCondition;
      const matchesLocation =
        !filterLocation || asset.location === filterLocation;

      return (
        matchesSearch && matchesCategory && matchesCondition && matchesLocation
      );
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

  const getStatusInfo = (status) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterCondition("");
    setFilterLocation("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="Assets"
      />

      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} title="All Assets" />

        <main className="p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Asset Management
                </h1>
                <p className="text-gray-600">
                  Manage and track all therapy center assets
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets by name, serial number, or assigned person..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Conditions</option>
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assets Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Assets ({filteredAssets.length})
                </h3>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
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
                      Status
                    </th>

                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAssets.map((asset) => {
                    const statusInfo = getStatusInfo(asset.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Package className="w-5 h-5 text-blue-600" />
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
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <StatusIcon
                              className={`w-4 h-4 mr-2 ${
                                statusInfo.color === "green"
                                  ? "text-green-500"
                                  : statusInfo.color === "blue"
                                  ? "text-blue-500"
                                  : statusInfo.color === "red"
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            />
                            <span className="text-sm text-gray-900">
                              {statusInfo.label}
                            </span>
                          </div>
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
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="py-1">
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Eye className="w-4 h-4 mr-3" />
                                    View Details
                                  </button>
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Edit2 className="w-4 h-4 mr-3" />
                                    Edit Asset
                                  </button>
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <FileText className="w-4 h-4 mr-3" />
                                    Generate Report
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-3" />
                                    Delete Asset
                                  </button>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredAssets.length)}{" "}
                    of {filteredAssets.length} assets
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assets found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                filterCategory ||
                filterCondition ||
                filterLocation
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first asset to the system."}
              </p>
              {!(
                searchTerm ||
                filterCategory ||
                filterCondition ||
                filterLocation
              ) && (
                <button className="flex items-center mx-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Asset
                </button>
              )}
            </div>
          )}
        </main>
      </div>
      {/* Add Asset Modal */}
      {showAddModal && (
        <AddAsset
          onClose={() => setShowAddModal(false)}
          onSave={(newAssetData) => {
            console.log("New asset data:", newAssetData);
            // Here you would typically add the asset to your state or send to API
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AllAssets;
