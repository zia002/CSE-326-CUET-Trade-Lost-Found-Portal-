import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetSignedInUserQuery,
  useDeleteUserMutation,
} from "../redux/features/auth/authApi";
import { signOut } from "../redux/features/auth/authSlice";
import avatarImg from "../assets/avatar.jpg";
import { FiEdit2, FiTrash2, FiUser, FiMail, FiPhone, FiHome, FiBriefcase, FiShield } from "react-icons/fi";

const MyProfile = () => {
  const { data: user, isLoading, isError } = useGetSignedInUserQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
    );
    if (!confirmed) return;

    try {
      await deleteUser(user?._id).unwrap();
      dispatch(signOut());
      navigate("/", { state: { accountDeleted: true } });
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert(error?.data?.message || error?.message || "Failed to delete account. Please try again later.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load profile</h2>
          <p className="text-gray-600 mb-4">We couldn't load your profile information. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-6 py-8 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.profileImage || avatarImg}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <span className="absolute bottom-0 right-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-white">
                {user.role}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-gray-800">{user.fullName}</h1>
              <p className="text-gray-600 mt-1">{user.profession || "Professional"}</p>
              <div className="mt-3 flex justify-center sm:justify-start gap-3">
                <Link
                  to="/dashboard/profile/edit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FiEdit2 size={14} />
                  Edit Profile
                </Link>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className={`flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    deleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiTrash2 size={14} />
                  {deleting ? "Processing..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FiMail size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FiPhone size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium text-gray-800">
                  {user.contactNumber || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FiHome size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">
                  {user.address || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FiBriefcase size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Profession</p>
                <p className="font-medium text-gray-800">
                  {user.profession || <span className="text-gray-400">Not specified</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <FiShield size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Role</p>
                <p className="font-medium text-gray-800 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-yellow-50 border-t border-yellow-100 px-6 py-4">
          <p className="text-sm text-yellow-700">
            <strong>Security note:</strong> Keep your profile information up to date and never share your login credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;