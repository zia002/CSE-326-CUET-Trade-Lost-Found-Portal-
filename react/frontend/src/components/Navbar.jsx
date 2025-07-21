import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FiShoppingCart,
  FiUser,
  FiArchive,
  FiHeart,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartModal from "./CartModal";
import AuthModal from "./AuthModal";
import { useDispatch } from "react-redux";
import avatarImg from "../assets/avatar.jpg";
import { useSignOutUserMutation } from "../redux/features/auth/authApi";
import { signOut } from "../redux/features/auth/authSlice";
import { clearCart } from "../redux/features/cart/cartSlice";
import { getBaseURL } from "../utils/baseURL";

const navLinks = [
  { to: "/", text: "Home" },
  { to: "/new-arrivals", text: "New Arrivals" },
  { to: "/pre-owned-products", text: "Pre-Owned" },
  { to: "/lost-found-products", text: "Lost & Found" },
];

const dropdownLinks = [
  { to: "/profile", text: "My Profile", icon: <FiUser className="mr-3" /> },
  { to: "/orders", text: "Orders", icon: <FiArchive className="mr-3" /> },
];

const Navbar = () => {
  const [signInDropdown, setSignInDropDownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const products = useSelector((state) => state.cart.products);

  const [isCartOpen, setisCartOpen] = useState(false);

  const dispatch = useDispatch();

  const cartRef = useRef(null);

  const [authModalType, setAuthModalType] = useState(null); // 'signin' or 'signup'

  const [user, setUser] = useState(null); // State to store user data

  const [loadingUser, setLoadingUser] = useState(true);

  // const handleReload = () => {
  //   sessionStorage.setItem("reloaded", "true");
  //   window.location.reload();
  //   sessionStorage.removeItem("reloaded");
  // };

  // useEffect(() => {
  //   if (sessionStorage.getItem("reloaded")) {
  //     sessionStorage.removeItem("reloaded");
  //   }
  // }, []);

  // Fetch the logged-in user's data
  const fetchUser = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        console.log("Failed to load user data. Please log in.");
      }
    } catch (err) {
      console.log("error fetching user data:", err);
    } finally {
      setLoadingUser(false); // Always end loading
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on component mount
  }, []);

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        setAuthModalType("signin");
      } else {
        setAuthModalType(null);
      }
    }
  }, [user, loadingUser]);

  // useEffect(() => {
  //   if (!loadingUser) {
  //     if (!user) {
  //       setAuthModalType("signin");
  //     } else {
  //       setAuthModalType(null);
  //       window.location.reload(); // 🔁 Reload after login/signup
  //     }
  //   }
  // }, [user, loadingUser]);

  useEffect(() => {
    const handleClickOutsideCart = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setisCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutsideCart);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCart);
    };
  }, [isCartOpen]);

  const handleCartToggle = () => {
    setisCartOpen(!isCartOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSignInDropDownOpen(false);
      }
    }
    if (signInDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [signInDropdown]);

  // Keyboard accessibility for dropdown
  function handleDropdownKey(e) {
    if (e.key === "Escape") setSignInDropDownOpen(false);
    if (e.key === "Enter" || e.key === " ") setSignInDropDownOpen((s) => !s);
  }

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleUserDropdownToggle = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleUserDropdownKey = (e) => {
    if (e.key === "Escape") setUserDropdownOpen(false);
    if (e.key === "Enter" || e.key === " ") setUserDropdownOpen((s) => !s);
  };

  const adminDropDownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Profile", path: "/dashboard/profile" },
    { label: "My Orders", path: "/orders" },
  ];

  const userDropDownMenus = [
    { label: "Dashboard", path: "/dashboard/" },
    { label: "My Profile", path: "/dashboard/profile" },
    { label: "My Orders", path: "/orders" },
  ];

  const dropdownMenus =
    user?.role === "admin" ? [...adminDropDownMenus] : [...userDropDownMenus];

  const [signOutUser] = useSignOutUserMutation();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Dispatch sign out action
      await signOutUser().unwrap();
      dispatch(clearCart());
      dispatch(signOut());
      navigate("/");
      window.location.reload(); // Reload to clear user state
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and name */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            aria-label="CUET Trade & Lost-Found Portal Home"
          >
            <div className="relative h-14 w-14 flex items-center justify-center bg-blue-50 rounded-full p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 border-2 border-blue-700 rounded-full opacity-30"></div>
              <img
                src={logo}
                alt="CUET Logo"
                className="h-12 w-12 object-contain"
              />
            </div>

            <span className="flex flex-col leading-tight">
              <span className="text-xl md:text-2xl font-extrabold font-serif text-blue-700 group-hover:text-blue-800 transition-colors">
                CUET Trade
              </span>
              <span className="text-sm md:text-base font-semibold text-gray-700 tracking-tight">
                & Lost-Found Portal
              </span>
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 font-semibold">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} text={link.text} />
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-6 font-semibold">
            <ActionLink
              to="/become-seller"
              icon={<FiArchive className="mr-2" />}
              text="Become A Seller"
              className="hidden md:flex"
            />

            <button
              onClick={handleCartToggle}
              className="flex items-center text-gray-700 hover:text-blue-600 font-semibold text-base cursor-pointer "
            >
              <FiShoppingCart className="mr-2 text-xl" />
              <span className="hidden md:inline">Cart</span>
            </button>

            {/* <button onClick={handleReload}>🔄 Refresh Page</button>; */}

            {/* Sign In Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <img
                    src={user?.profileImage || avatarImg}
                    alt=""
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onMouseEnter={handleUserDropdownToggle}
                    onKeyDown={handleUserDropdownKey}
                    tabIndex={0}
                  />
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 transition-all duration-200 origin-top-right z-50 animate-fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Welcome, {user.fullName.split(" ")[0]}
                        </p>
                        <button
                          className="text-sm font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                          tabIndex={0}
                          onClick={handleSignOut}
                        >
                          Sign out
                        </button>
                      </div>
                      <div className="py-1">
                        {dropdownMenus.map((menu) => (
                          <DropdownLink
                            key={menu.path}
                            to={menu.path}
                            text={menu.label}
                            icon={<FiChevronDown className="mr-3" />}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={signInDropdown}
                  tabIndex={0}
                  onKeyDown={handleDropdownKey}
                  onMouseEnter={() => setSignInDropDownOpen(true)}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-semibold text-base transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 cursor-pointer"
                  onClick={() => setAuthModalType("signin")}
                >
                  <FiUser className="mr-2 text-xl" />
                  <span className="hidden md:inline">Sign In</span>
                  {signInDropdown ? (
                    <FiChevronUp className="ml-1 transition-transform duration-200" />
                  ) : (
                    <FiChevronDown className="ml-1 transition-transform duration-200" />
                  )}
                </button>
              )}

              {/* Dropdown Menu */}
              {signInDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 transition-all duration-200 origin-top-right z-50 animate-fade-in"
                  onMouseLeave={() => setSignInDropDownOpen(false)}
                >
                  <div className="px-4 py-3 flex justify-between items-center">
                    <p className="text-sm text-gray-500">New customer?</p>
                    <button
                      className="text-sm font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                      tabIndex={0}
                      onClick={() => setAuthModalType("signup")}
                    >
                      Sign up
                    </button>
                  </div>
                  <div className="py-1">
                    {dropdownLinks.map((link) => (
                      <DropdownLink key={link.to} {...link} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isCartOpen && (
        <CartModal
          products={products}
          isOpen={isCartOpen}
          onClose={handleCartToggle}
          cartRef={cartRef}
        />
      )}
      {authModalType && (
        <AuthModal
          type={authModalType}
          onClose={() => setAuthModalType(null)}
        />
      )}
    </header>
  );
};

// Reusable NavLink
function NavLink({ to, text }) {
  return (
    <Link
      to={to}
      className="relative py-3 px-1 text-gray-700 hover:text-blue-600 font-semibold text-base uppercase tracking-wider transition-colors duration-300
        after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300
        hover:after:w-full"
    >
      {text}
    </Link>
  );
}

// Reusable ActionLink (for seller/cart)
function ActionLink({ to, icon, text, className = "" }) {
  return (
    <Link
      to={to}
      className={`${className} items-center text-gray-700 hover:text-blue-600 font-semibold text-base transition-colors duration-300`}
    >
      {icon}
      <span className="hidden lg:inline">{text}</span>
    </Link>
  );
}

// Reusable DropdownLink
function DropdownLink({ to, text, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 font-semibold"
    >
      {icon}
      {text}
    </Link>
  );
}

export default Navbar;
