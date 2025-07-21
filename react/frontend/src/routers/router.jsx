// src/router/index.js or wherever your router lives
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/home/Home.jsx";
import NewArrivalsPage from "../pages/NewArrivalsPage.jsx"; // ✅ Import
import PreOwnedProductsPage from "../pages/PreOwnedProductsPage.jsx"; // ✅ Import
import LostFoundProductsPage from "../pages/LostFoundProductsPage.jsx"; // ✅ Import
import PostLostFoundPage from "../pages/PostLostFoundPage.jsx"; // ✅ Import
import PostPreOwnedPage from "../pages/PostPreOwnedPage.jsx"; // ✅ Import
import BecomeSellerPage from "../pages/BecomeSellerPage.jsx"; // ✅ Import
// import CartPage from "../pages/CartPage.jsx"; // ✅ Import if needed
import ProductDetailsPage from "../pages/ProductDetailsPage.jsx"; // ✅ Import if needed
import PostFoundPage from "../pages/PostFoundPage.jsx";
import PostLostPage from "../pages/PostLostPage.jsx"; // ✅ Import if needed
import PostDigitalPage from "../pages/PostDigitalPage.jsx";
import PostFashionPage from "../pages/PostFashionPage.jsx";
import PostElectronicsPage from "../pages/PostElectronicsPage.jsx";
import PostOthersPage from "../pages/PostOthersPage.jsx";
import MyProfile from "../components/MyProfile.jsx";
import EditProfile from "../components/EditProfile.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import AdminUserManagement from "../pages/AdminUserManagement.jsx"; // ✅ Import
import AdminProductManagement from "../pages/AdminProductManagement.jsx"; // ✅ Import
import UserProductManagement from "../pages/UserProductManagement.jsx";
import EditProduct from "../pages/EditProduct"; // ✅ Import
import ManageBidsPage from "../pages/ManageBidsPage.jsx"; // ✅ Import if needed
import MyBidsPage from "../pages/MyBidsPage.jsx";
import ChooseDeliveryPage from "../pages/ChooseDeliveryPage.jsx";
import OrderConfirmationPage from "../pages/OrderConfirmationPage.jsx";
import OrderSuccessPage from "../pages/OrderSuccessPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import OrdersPageSeller from "../pages/OrderPageSeller.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/new-arrivals", element: <NewArrivalsPage /> }, // ✅ Add this line
      { path: "/pre-owned-products", element: <PreOwnedProductsPage /> },
      { path: "/lost-found-products", element: <LostFoundProductsPage /> },
      { path: "/post-lost-found", element: <PostLostFoundPage /> },
      { path: "/post-pre-owned", element: <PostPreOwnedPage /> },
      { path: "/become-seller", element: <BecomeSellerPage /> }, // ✅ Add this line
      // { path: "/cart", element: <CartPage /> }, // ✅ Add this line
      { path: "/products/:id", element: <ProductDetailsPage /> }, // ✅ Add this line
      { path: "/post-found", element: <PostFoundPage /> }, // ✅ Add this line
      { path: "/post-lost", element: <PostLostPage /> }, // ✅ Add this line
      { path: "/post-digital", element: <PostDigitalPage /> }, // ✅ Add this line
      { path: "/post-fashion", element: <PostFashionPage /> }, // ✅ Add this line
      { path: "/post-electronics", element: <PostElectronicsPage /> }, // ✅ Add this line
      { path: "/post-others", element: <PostOthersPage /> }, // ✅ Add this line
      { path: "/dashboard/profile", element: <MyProfile /> },
      { path: "/dashboard/profile/edit", element: <EditProfile /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/admin/users", element: <AdminUserManagement /> }, // ✅ Add this line
      { path: "/admin/products", element: <AdminProductManagement /> }, // ✅ Add this line
      { path: "/dashboard/listings", element: <UserProductManagement /> }, // ✅ Add this line
      { path: "/edit-product/:id", element: <EditProduct /> }, // ✅ Add this line
      { path: "/dashboard/bids/:id", element: <ManageBidsPage /> }, // ✅ Add this line
      { path: "/dashboard/bids", element: <MyBidsPage /> }, // ✅ Add this line
      { path: "/choose-delivery", element: <ChooseDeliveryPage /> }, // ✅ Add this line
      { path: "/order-confirmation", element: <OrderConfirmationPage /> }, // ✅ Add this line
      { path: "/order-success", element: <OrderSuccessPage /> }, // ✅ Add this line
      { path: "/orders", element: <OrdersPage /> },
      { path: "/dashboard/orders", element: <OrdersPageSeller /> },
    ],
  },
]);

export default router;
