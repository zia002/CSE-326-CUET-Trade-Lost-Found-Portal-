import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetSignedInUserQuery,
  useDeleteUserMutation,
} from "../redux/features/auth/authApi";
import { signOut } from "../redux/features/auth/authSlice";
import avatarImg from "../assets/avatar.jpg";

const MyProfile = () => {
  const { data: user, isLoading, isError } = useGetSignedInUserQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await deleteUser(user._id).unwrap();
      dispatch(signOut());
      alert("Account deleted successfully.");
      navigate("/");
    } catch (error) {
      alert(error?.data?.message || "Failed to delete account.");
    }
  };

  if (isLoading) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  if (isError || !user) return <p className="text-center mt-10 text-red-500">Failed to load profile.</p>;

  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-4">👤 My Profile</h1>
          <p className="text-gray-600 text-lg">Manage your account information</p>
        </div>

        {/* Profile Info */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10">
          <div className="flex justify-center mb-6">
            <img
              src={user.profileImage || avatarImg}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border border-gray-300"
            />
          </div>

          <div className="text-left space-y-4 text-gray-700 text-sm sm:text-base">
            <p><span className="font-semibold text-gray-900">Full Name:</span> {user.fullName}</p>
            <p><span className="font-semibold text-gray-900">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-gray-900">Contact:</span> {user.contactNumber || "Not set"}</p>
            <p><span className="font-semibold text-gray-900">Address:</span> {user.address || "Not set"}</p>
            <p><span className="font-semibold text-gray-900">Profession:</span> {user.profession || "Not set"}</p>
            <p><span className="font-semibold text-gray-900">Role:</span> {user.role}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/dashboard/profile/edit"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            ✏️ Edit Profile
          </Link>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className={`px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            🗑️ {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
