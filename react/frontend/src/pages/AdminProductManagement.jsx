import React, { useEffect, useState } from "react";
import { getBaseURL } from "../utils/baseURL";
import { FiTrash2, FiEye, FiSearch, FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${getBaseURL()}/api/products`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [refresh]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${getBaseURL()}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Product deleted successfully");
        setRefresh((prev) => !prev);
      } else {
        alert(data.message || "❌ Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Something went wrong");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.postedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage all products listed on the platform</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <FiAlertTriangle className="text-red-500 mr-2" />
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
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                        {p.postedBy?.fullName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.bids?.length ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {p.bids?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link 
                            to={`/products/${p._id}`} 
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition"
                            title="View Details"
                          >
                            <FiEye className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                            title="Delete Product"
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
                      No products found matching your search criteria
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

export default AdminProductManagement;




// import React, { useEffect, useState } from "react";
// import { getBaseURL } from "../utils/baseURL";
// import { FiTrash2, FiEye } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const AdminProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${getBaseURL()}/api/products`, {
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setProducts(data);
//         } else {
//           console.error("Failed to fetch products:", data);
//         }
//       } catch (err) {
//         console.log("error fetching products:", err);
//       }
//     };

//     fetchProducts();
//   }, [refresh]);

//   const handleDelete = async (id) => {
//     const confirm = window.confirm(
//       "Are you sure you want to delete this product?"
//     );
//     if (!confirm) return;

//     try {
//       const res = await fetch(`${getBaseURL()}/api/products/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         alert("✅ Product deleted successfully");
//         setRefresh((prev) => !prev);
//       } else {
//         alert(data.message || "❌ Failed to delete product");
//       }
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       alert("❌ Something went wrong");
//     }
//   };

//   const filtered = products.filter(
//     (p) =>
//       p.title.toLowerCase().includes(search.toLowerCase()) ||
//       p.postedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">📦 Manage All Products</h1>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by title or posted by"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full sm:w-1/2 px-4 py-2 border rounded"
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow rounded">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
//               <th className="p-4">Title</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">Posted By</th>
//               <th className="p-4">Created At</th>
//               <th className="p-4">Bids</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((p) => (
//               <tr key={p._id} className="border-b text-sm">
//                 <td className="p-4 font-medium text-gray-900">{p.title}</td>
//                 <td className="p-4 capitalize">{p.category}</td>
//                 <td className="p-4">{p.postedBy?.fullName || "N/A"}</td>
//                 <td className="p-4">
//                   {new Date(p.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="p-4 text-center">{p.bids?.length || 0}</td>
//                 <td className="p-4 flex gap-3 items-center">
//                   <Link to={`/products/${p._id}`} title="View Details">
//                     <FiEye className="text-blue-600 hover:text-blue-800" />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="text-red-600 hover:text-red-800"
//                     title="Delete Product"
//                   >
//                     <FiTrash2 />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminProductManagement;
