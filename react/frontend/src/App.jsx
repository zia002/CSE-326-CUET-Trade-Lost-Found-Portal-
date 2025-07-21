import { Outlet, useLocation } from "react-router-dom"; // 🆕 Added useLocation
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetSignedInUserQuery } from "./redux/features/auth/authApi";
import { getBaseURL } from "./utils/baseURL";
import { addToCart } from "./redux/features/cart/cartSlice";
import { signOut, setUser } from "./redux/features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation(); // 🆕 Track route changes

  const { data: user, isError, error } = useGetSignedInUserQuery();

  const fetchUserCart = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/api/cart`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      data.items.forEach((item) => {
        dispatch(
          addToCart({
            ...item.product,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            id: item.product._id,
          })
        );
      });
    } catch (error) {
      console.error("❌ Failed to load cart:", error.message);
    }
  };

  // 👤 Load cart if user is present
  useEffect(() => {
    if (user) {
      dispatch(setUser({ user }));
      fetchUserCart();
    }
  }, [user]);

  // 🔒 Auto-logout if token is expired or invalid
  useEffect(() => {
    if (isError && error?.status === 401) {
      dispatch(signOut());
      console.warn("🔒 Token expired or invalid — user signed out");
    }
  }, [isError, error, dispatch]);

  // 🔁 Refresh on route change — only once
  useEffect(() => {
    const alreadyReloaded = sessionStorage.getItem("reloaded");
    if (!alreadyReloaded) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }
  }, [location.pathname]);

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-100 to-blue-50">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
