// import React, { useState, useEffect } from "react";
// import {
//   useEditProfileMutation,
//   useGetSignedInUserQuery,
// } from "../redux/features/auth/authApi";
// import { useNavigate } from "react-router-dom";
// // import { toast } from "react-hot-toast"; // Optional
// import { uploadImageToCloudinary } from "../utils/cloudinary"; // ✅ Import the Cloudinary upload function

// const EditProfile = () => {
//   const { data: user, isLoading } = useGetSignedInUserQuery();
//   const [editProfile, { isLoading: isUpdating }] = useEditProfileMutation();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     contactNumber: "",
//     address: "",
//     profession: "",
//     profileImage: "",
//   });

//   const [imagePreview, setImagePreview] = useState("");
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (!user) return;
//     setFormData({
//       fullName: user?.fullName || "",
//       contactNumber: user?.contactNumber || "",
//       address: user?.address || "",
//       profession: user?.profession || "",
//       profileImage: user?.profileImage || "",
//     });
//     setImagePreview(user?.profileImage || "");
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const renderInput = (name, type = "text") => (
//     <div key={name}>
//       <label className="block text-gray-600 mb-1 capitalize">
//         {name.replace(/([A-Z])/g, " $1")}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={formData[name]}
//         onChange={handleChange}
//         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
//       />
//     </div>
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.fullName || !formData.contactNumber) {
//       alert("Full name and contact number are required.");
//       return;
//     }

//     try {
//       await editProfile(formData).unwrap();
//       alert("Profile updated successfully!");
//       // toast.success("Profile updated!"); // optional
//       navigate("/dashboard/profile");
//     } catch (error) {
//       console.error("Update failed:", error);
//       alert("Failed to update profile. Try again.");
//       // toast.error("Profile update failed"); // optional
//     }
//   };

//   if (isLoading) {
//     return (
//       <p className="text-center mt-10 text-gray-600">Loading profile...</p>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow space-y-6">
//       <h2 className="text-2xl font-bold text-center text-indigo-700">
//         Edit Profile
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {["fullName", "contactNumber", "address", "profession"].map((field) =>
//           renderInput(field)
//         )}

//         {/* ✅ Profile Image Upload & Preview */}
//         <div>
//           <label className="block text-gray-600 mb-1">Profile Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={async (e) => {
//               const file = e.target.files[0];
//               if (!file) return;

//               try {
//                 setUploading(true);
//                 const imageUrl = await uploadImageToCloudinary(file, "profile");
//                 console.log("Image uploaded:", imageUrl);
//                 setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
//                 setImagePreview(imageUrl);
//               } catch (err) {
//                 console.error("Upload failed", err);
//                 alert("Image upload failed");
//               } finally {
//                 setUploading(false);
//               }
//             }}
//             className="w-full border rounded px-3 py-2"
//           />

//           {uploading && (
//             <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
//           )}

//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="mt-3 w-28 h-28 object-cover rounded-full border mx-auto"
//             />
//           )}
//         </div>

        

//         <button
//           type="submit"
//           disabled={isUpdating}
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
//         >
//           {isUpdating ? "Updating..." : "Update Profile"}
//         </button>
        
//       </form>
      
//     </div>
//   );
// };

// export default EditProfile;


import React, { useState, useEffect } from "react";
import {
  useEditProfileMutation,
  useGetSignedInUserQuery,
} from "../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiHome, FiBriefcase, FiCamera, FiArrowLeft } from "react-icons/fi";
import { uploadImageToCloudinary } from "../utils/cloudinary";

const EditProfile = () => {
  const { data: user, isLoading, isError } = useGetSignedInUserQuery();
  const [editProfile, { isLoading: isUpdating }] = useEditProfileMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    address: "",
    profession: "",
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user?.fullName || "",
        contactNumber: user?.contactNumber || "",
        address: user?.address || "",
        profession: user?.profession || "",
        profileImage: user?.profileImage || "",
      });
      setImagePreview(user?.profileImage || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(file, "profile");
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      setImagePreview(imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await editProfile(formData).unwrap();
      alert("Profile updated successfully!");
      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Update failed:", error);
      alert(error?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 max-w-md bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading profile</h2>
          <p className="text-gray-600 mb-4">We couldn't load your profile information. Please try again later.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiArrowLeft className="text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiUser size={48} />
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className={`absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FiCamera className="text-indigo-600" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <p className="text-sm text-gray-500">Uploading image...</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-gray-500" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiPhone className="mr-2 text-gray-500" />
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 ${errors.contactNumber ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiHome className="mr-2 text-gray-500" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiBriefcase className="mr-2 text-gray-500" />
                Profession
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUpdating || uploading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition ${isUpdating || uploading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;