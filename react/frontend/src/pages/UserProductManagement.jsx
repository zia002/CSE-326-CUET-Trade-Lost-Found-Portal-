import React, { useEffect, useState } from "react";
import { getBaseURL } from "../utils/baseURL";
import { FiTrash2, FiEdit, FiUsers, FiSearch, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetSignedInUserQuery } from "../redux/features/auth/authApi";

const UserProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const { data: user, isLoading, isError } = useGetSignedInUserQuery();

  const currUserId = user?._id || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currUserId) return;

      try {
        const res = await fetch(
          `${getBaseURL()}/api/products?postedBy=${currUserId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          console.error("Failed to fetch products:", data);
        }
      } catch (err) {
        console.log("error fetching products:", err);
      }
    };

    fetchProducts();
  }, [refresh, currUserId]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirm) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`${getBaseURL()}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRefresh((prev) => !prev);
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Something went wrong");
    } finally {
      setIsDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">Error loading user data</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your uploaded products</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bids
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{p.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
                      {p.category === "pre-owned" ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.bids?.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {p.bids?.length || 0}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link 
                          to={`/edit-product/${p._id}`} 
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        {p.category === "pre-owned" && (
                          <Link 
                            to={`/dashboard/bids/${p._id}`} 
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition"
                            title="Manage Bids"
                          >
                            <FiUsers className="h-5 w-5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                          title="Delete"
                          disabled={isDeleting === p._id}
                        >
                          {isDeleting === p._id ? (
                            <FiLoader className="h-5 w-5 animate-spin" />
                          ) : (
                            <FiTrash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {products.length === 0 ? "You haven't uploaded any products yet" : "No products match your search"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProductManagement;