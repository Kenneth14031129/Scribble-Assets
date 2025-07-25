import { useState, useEffect } from "react";
import {
  Package,
  DollarSign,
  Settings,
  FileText,
  Save,
  X,
  Camera,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { updateAsset } from "../services/api";

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `http://localhost:5000${imagePath}`;
};

const EditAsset = ({ asset, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serialNumber: "",
    purchaseDate: "",
    purchasePrice: "",
    condition: "excellent",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (asset) {
      // Convert category label back to value for the API
      const getCategoryValue = (categoryLabel) => {
        const categoryMap = {
          "Medical Equipment": "medical",
          "Therapy Tools": "therapy",
          Furniture: "furniture",
          Supplies: "supplies",
          Other: "other",
        };
        return categoryMap[categoryLabel] || categoryLabel.toLowerCase();
      };

      setFormData({
        name: asset.name || "",
        category: getCategoryValue(asset.category),
        serialNumber: asset.serialNumber || "",
        purchaseDate: asset.purchaseDate || "",
        purchasePrice: asset.purchasePrice || "",
        condition: asset.condition || "excellent",
        image: null,
      });
    }
  }, [asset]);

  const categories = [
    { value: "medical", label: "Medical Equipment" },
    { value: "therapy", label: "Therapy Tools" },
    { value: "furniture", label: "Furniture" },
    { value: "supplies", label: "Supplies" },
    { value: "other", label: "Other" },
  ];

  const conditionOptions = [
    { value: "excellent", label: "Excellent", color: "green" },
    { value: "good", label: "Good", color: "blue" },
    { value: "fair", label: "Fair", color: "yellow" },
    { value: "poor", label: "Poor", color: "red" },
    { value: "out-of-service", label: "Out of Service", color: "gray" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setHasChanges(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setHasChanges(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Asset name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.serialNumber.trim())
      newErrors.serialNumber = "Serial number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // Prepare data for API
      const apiData = {
        name: formData.name,
        category: formData.category,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice)
          : undefined,
        condition: formData.condition,
      };

      const result = await updateAsset(asset.id, apiData, formData.image);

      setSubmitSuccess(true);
      setHasChanges(false);

      if (onSave) {
        onSave(result.data);
      }

      // Close modal after 1.5 seconds to show success message
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error("Error updating asset:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!asset) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                {asset.image ? (
                  <img
                    src={getImageUrl(asset.image)}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Edit Asset
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-mono">
                  {asset.serialNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {hasChanges && (
                <div className="hidden sm:flex items-center text-amber-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Unsaved changes
                </div>
              )}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          {hasChanges && (
            <div className="sm:hidden flex items-center text-amber-600 text-xs mt-2">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unsaved changes
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {(submitSuccess || submitError) && (
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
            {submitSuccess && (
              <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  Asset updated successfully!
                </span>
              </div>
            )}
            {submitError && (
              <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{submitError}</span>
              </div>
            )}
          </div>
        )}

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Left Column */}
              <div className="space-y-4 lg:space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Basic Information
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., Ultrasound Machine Model X200"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            errors.category
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.category}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Serial Number *
                        </label>
                        <input
                          type="text"
                          name="serialNumber"
                          value={formData.serialNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            errors.serialNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter serial number"
                        />
                        {errors.serialNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.serialNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Purchase Information
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purchase Date
                        </label>
                        <input
                          type="date"
                          name="purchaseDate"
                          value={formData.purchaseDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purchase Price
                        </label>
                        <input
                          type="number"
                          name="purchasePrice"
                          value={formData.purchasePrice}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 lg:space-y-6">
                {/*  Additional Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Additional Information
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {conditionOptions.map((condition) => (
                          <label
                            key={condition.value}
                            className={`flex items-center p-2 sm:p-3 border rounded-lg cursor-pointer transition-colors ${
                              formData.condition === condition.value
                                ? `border-${condition.color}-500 bg-${condition.color}-50`
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="condition"
                              value={condition.value}
                              checked={formData.condition === condition.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                condition.color === "green"
                                  ? "bg-green-500"
                                  : condition.color === "blue"
                                  ? "bg-blue-500"
                                  : condition.color === "yellow"
                                  ? "bg-yellow-500"
                                  : condition.color === "red"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                            <span className="text-xs sm:text-sm font-medium">
                              {condition.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-gray-400 transition-colors">
                        {/* Current Image Display */}
                        {asset.image && !formData.image && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">
                              Current image:
                            </p>
                            <div className="flex justify-center">
                              <img
                                src={getImageUrl(asset.image)}
                                alt={asset.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-300 mx-auto"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer block"
                        >
                          <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formData.image
                              ? formData.image.name
                              : asset.image
                              ? "Click to upload new image"
                              : "Click to upload image"}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="hidden sm:flex items-center text-xs sm:text-sm text-gray-500">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Asset
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAsset;
