import {
  Package,
  X,
  MapPin,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Wrench,
  XCircle,
  Building,
  Hash,
} from "lucide-react";

const ViewDetails = ({ asset, onClose }) => {
  if (!asset) return null;

  const getConditionColor = (condition) => {
    const conditions = {
      excellent: "green",
      good: "blue",
      fair: "yellow",
      poor: "red",
      "out-of-service": "gray",
    };
    return conditions[condition] || "gray";
  };

  const getStatusInfo = (status) => {
    const statusOptions = {
      available: { label: "Available", color: "green", icon: CheckCircle },
      "in-use": { label: "In Use", color: "blue", icon: Clock },
      "out-of-service": {
        label: "Out of Service",
        color: "gray",
        icon: XCircle,
      },
    };
    return statusOptions[status] || statusOptions.available;
  };

  const statusInfo = getStatusInfo(asset.status);
  const StatusIcon = statusInfo.icon;
  const conditionColor = getConditionColor(asset.condition);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                  {asset.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-mono truncate">
                  {asset.serialNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors ml-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Status and Condition Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    Status
                  </span>
                  <div className="flex items-center">
                    <StatusIcon
                      className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${
                        statusInfo.color === "green"
                          ? "text-green-500"
                          : statusInfo.color === "blue"
                          ? "text-blue-500"
                          : statusInfo.color === "red"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    Condition
                  </span>
                  <span
                    className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      conditionColor === "green"
                        ? "bg-green-100 text-green-800"
                        : conditionColor === "blue"
                        ? "bg-blue-100 text-blue-800"
                        : conditionColor === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : conditionColor === "red"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {asset.condition.charAt(0).toUpperCase() +
                      asset.condition.slice(1).replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Basic Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Asset Name
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900 break-words">
                        {asset.name}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-t border-gray-100 gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Category
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900">
                        {asset.category}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-t border-gray-100 gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                        <Hash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Serial Number
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900 font-mono break-all">
                        {asset.serialNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Purchase Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Purchase Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Purchase Date
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900">
                        {formatDate(asset.purchaseDate)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-t border-gray-100 gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        Purchase Price
                      </span>
                      <span className="text-xs sm:text-sm text-gray-900 font-semibold">
                        {formatCurrency(asset.purchasePrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
