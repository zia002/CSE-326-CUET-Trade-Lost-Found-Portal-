import React, { useEffect, useState } from "react";
import { getBaseURL } from "../utils/baseURL";
import { FiTrash2, FiEdit, FiSearch, FiUser, FiUserCheck, FiAlertCircle } from "react-icons/fi";
import { useGetSignedInUserQuery } from "../redux/features/auth/authApi";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: currentUser } = useGetSignedInUserQuery();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${getBaseURL()}/api/auth/users`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const handleDelete = async (userId) => {
    if (userId === currentUser?._id) {
      return alert("You cannot delete your own account.");
    }

    const confirm = window.confirm(
      "Are you sure you want to permanently delete this user? All their data will be removed."
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${getBaseURL()}/api/auth/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully");
        setRefresh((prev) => !prev);
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Something went wrong");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${getBaseURL()}/api/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setRefresh((prev) => !prev);
      } else {
        alert(data.message || "Failed to update role");
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Something went wrong");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RoleBadge = ({ role }) => {
    const roleStyles = {
      admin: "bg-purple-100 text-purple-800",
      user: "bg-blue-100 text-blue-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all user accounts on the platform</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.role === 'admin' ? (
                              <FiUserCheck className="h-5 w-5 text-purple-600" />
                            ) : (
                              <FiUser className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-gray-500 text-sm">{user.profession || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`bg-transparent border rounded-md px-2 py-1 text-sm ${user._id === currentUser?._id ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                          disabled={user._id === currentUser?._id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.contactNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className={`p-1 rounded transition ${
                              user._id === currentUser?._id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-900 hover:bg-red-50"
                            }`}
                            title={user._id === currentUser?._id ? "Cannot delete your own account" : "Delete user"}
                            disabled={user._id === currentUser?._id}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No users found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;