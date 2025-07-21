import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBaseURL } from "../utils/baseURL";
import {
  FiUpload,
  FiImage,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiMapPin,
  FiSave,
} from "react-icons/fi";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    perWhich: "piece",
    features: "",
    availableSizes: "",
    location: "",
    endsIn: "",
    imageURL: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${getBaseURL()}/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            ...data,
            features: data.features?.join(", ") || "",
            availableSizes: data.availableSizes?.join(", ") || "",
          });
          setImagePreview(data.imageURL);
        } else {
          setErrorMsg(data.message || "Failed to load product");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to fetch product. Please try again later.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear any existing error when user edits
    if (errorMsg) setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrorMsg("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setErrorMsg("Title is required");
      return false;
    }
    if (!formData.category) {
      setErrorMsg("Category is required");
      return false;
    }
    if (showPrice && !formData.price) {
      setErrorMsg("Price is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let imageURL = formData.imageURL;

      // Upload new image if selected
      if (imageFile) {
        const imageForm = new FormData();
        imageForm.append("image", imageFile);
        imageForm.append("type", "product");

        setIsUploading(true);
        const uploadRes = await fetch(`${getBaseURL()}/api/upload/image`, {
          method: "POST",
          body: imageForm,
        });

        const uploadData = await uploadRes.json();
        setIsUploading(false);

        if (!uploadRes.ok)
          throw new Error(uploadData.message || "Image upload failed");
        imageURL = uploadData.url;
      }

      // Prepare payload
      const payload = {
        ...formData,
        imageURL,
        features: formData.features.split(",").map((f) => f.trim()),
        availableSizes: formData.availableSizes.split(",").map((s) => s.trim()),
      };

      if (formData.category === "pre-owned" && formData.endsIn) {
        payload.endsIn = formData.endsIn;
      }

      // Update product
      const res = await fetch(
        `${getBaseURL()}/api/products/update-product/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Product updated successfully!");
        setTimeout(() => navigate("/dashboard/listings"), 1500);
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conditional rendering flags
  const showPrice = !["lost", "found"].includes(formData.category);
  const showSizes = formData.category === "fashion";
  const showFeatures = !["lost", "found"].includes(formData.category);
  const showAuction = formData.category === "pre-owned";
  const showLocation = ["lost", "found"].includes(formData.category);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <p className="text-sm text-gray-600">Update your product details</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="p-6 space-y-6"
        >
          {/* Status Messages */}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              {errorMsg}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                required
                disabled
              >
                <option value="">Select Category</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="digital">Digital</option>
                <option value="others">Others</option>
                <option value="pre-owned">Pre-Owned</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Describe your product in detail"
            />
          </div>

          {/* Pricing */}
          {showPrice && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  ৳
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiTag className="mr-2 text-gray-500" />
                  Price Unit
                </label>
                <input
                  type="text"
                  name="perWhich"
                  value={formData.perWhich}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  placeholder="e.g. piece, day, month"
                />
              </div>
            </div>
          )}

          {/* Features */}
          {showFeatures && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter features separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple features with commas (e.g., waterproof,
                wireless, 5G)
              </p>
            </div>
          )}

          {/* Sizes */}
          {showSizes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Sizes
              </label>
              <input
                type="text"
                name="availableSizes"
                value={formData.availableSizes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter sizes separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple sizes with commas (e.g., S, M, L, XL)
              </p>
            </div>
          )}

          {/* Auction */}
          {showAuction && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiCalendar className="mr-2 text-gray-500" />
                Auction Duration
              </label>
              <input
                type="text"
                name="endsIn"
                value={formData.endsIn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="e.g. 1d 4h 20m"
              />
            </div>
          )}

          {/* Location */}
          {showLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiMapPin className="mr-2 text-gray-500" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="Where was this item lost/found?"
              />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <label className="cursor-pointer flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <FiImage className="text-gray-400 text-3xl mb-2" />
                <p className="text-blue-600 font-medium">Click to upload</p>
                <p className="text-sm text-gray-500 mt-1">
                  or drag and drop image here
                </p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
              </label>
            </div>

            {isUploading && (
              <div className="mt-3 text-center text-blue-600 text-sm">
                Uploading image...
              </div>
            )}

            {imagePreview && !isUploading && (
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-48 object-contain rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center ${
                isSubmitting || isUploading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiSave className="mr-2" />
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
