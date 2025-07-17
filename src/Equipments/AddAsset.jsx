import { useState } from "react";
import {
  Package,
  DollarSign,
  MapPin,
  FileText,
  Save,
  X,
  Camera,
  Tag,
  Settings,
  Clock,
} from "lucide-react";

const AddAsset = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    purchaseDate: "",
    purchasePrice: "",
    supplier: "",
    location: "",
    department: "",
    assignedTo: "",
    condition: "excellent",
    warrantyExpiry: "",
    description: "",
    tags: [],
    maintenanceSchedule: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "medical", label: "Medical Equipment" },
    { value: "therapy", label: "Therapy Tools" },
    { value: "furniture", label: "Furniture" },
    { value: "it", label: "IT Equipment" },
    { value: "supplies", label: "Supplies" },
    { value: "other", label: "Other" },
  ];

  const locations = [
    "Reception Area",
    "Waiting Room",
    "Physical Therapy Room 1",
    "Physical Therapy Room 2",
    "Occupational Therapy Room",
    "Speech Therapy Room",
    "Examination Room 1",
    "Examination Room 2",
    "Storage Room",
    "Office",
    "Conference Room",
  ];

  const departments = [
    "Physical Therapy",
    "Occupational Therapy",
    "Speech Therapy",
    "Administration",
    "Maintenance",
    "IT Support",
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
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Asset name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.serialNumber.trim())
      newErrors.serialNumber = "Serial number is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.department) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        onSave(formData);
      }

      // Reset form or close modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving asset:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Asset
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter model number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Serial Number *
                        </label>
                        <input
                          type="text"
                          name="serialNumber"
                          value={formData.serialNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          name="manufacturer"
                          value={formData.manufacturer}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter manufacturer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Purchase Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purchase Date
                        </label>
                        <input
                          type="date"
                          name="purchaseDate"
                          value={formData.purchaseDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Location & Assignment */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location & Assignment
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Location</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.department
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.department}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned To
                      </label>
                      <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter staff member name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {conditionOptions.map((condition) => (
                          <label
                            key={condition.value}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
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
                            <span className="text-sm font-medium">
                              {condition.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Additional Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            {formData.image
                              ? formData.image.name
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
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Asset
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;
