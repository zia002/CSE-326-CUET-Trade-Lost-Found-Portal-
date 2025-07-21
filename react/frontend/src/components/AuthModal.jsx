import React, { useState, useEffect, useRef } from "react";
import { FaWindowClose, FaEye, FaEyeSlash } from "react-icons/fa";
import "boxicons/css/boxicons.min.css";
import "./AuthModal.css";
import {
  useSignInUserMutation,
  useSignUpUserMutation,
} from "../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth/authSlice";
import { addToCart } from "../redux/features/cart/cartSlice"; // ✅ Don't forget this
import { getBaseURL } from "../utils/baseURL"; // ✅ Adjust path if needed
import { useNavigate } from "react-router-dom";

const AuthModal = ({ type, onClose }) => {
  const [isRegister, setIsRegister] = useState(type === "signup");
  const modalRef = useRef(null);

  useEffect(() => {
    setIsRegister(type === "signup");
  }, [type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Separate states for Sign In and Sign Up
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInMessage, setSignInMessage] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpMessage, setSignUpMessage] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const cuetEmailRegex =
    /^(u(0[1-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[0-9]{2}|1[0-7][0-9]|180)@student\.cuet\.ac\.bd|.+@cuet\.ac\.bd)$/;

  const dispatch = useDispatch();
  const [signInUser, { isLoading: signInLoading }] = useSignInUserMutation();
  const [signUpUser, { isLoading: signUpLoading }] = useSignUpUserMutation();

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
            id: item.product._id,
          })
        );
      });
    } catch (error) {
      console.error("❌ Failed to load cart:", error.message);
    }
  };

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!cuetEmailRegex.test(signInEmail)) {
      setSignInMessage("Please use a valid CUET email address.");
      return;
    }

    try {
      const response = await signInUser({
        email: signInEmail,
        password: signInPassword,
      }).unwrap(); // ✅ Must await unwrap()

      localStorage.setItem("token", response.token);
      document.cookie = `token=${response.token}; path=/; secure; HttpOnly`;
      console.log("Token set in cookie:", response.token);

      const { user } = response;
      dispatch(setUser({ user }));

      alert("Sign In Successful!");

      setSignInEmail("");
      setSignInPassword("");
      setSignInMessage("");

      navigate("/"); // Redirect to home page
      window.location.reload(); // Reload to clear user state

      onClose(); // Close modal on success

      await fetchUserCart();
    } catch (error) {
      console.error("❌ Sign In Error:", error);
      setSignInMessage("Invalid email or password. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!cuetEmailRegex.test(signUpEmail)) {
      setSignUpMessage("Please use a valid CUET email address.");
      return;
    }

    try {
      const response = await signUpUser({
        fullName: signUpFullName,
        email: signUpEmail,
        password: signUpPassword,
      }).unwrap(); // ✅ Get raw data

      localStorage.setItem("token", response.token);
      document.cookie = `token=${response.token}; path=/; secure; HttpOnly`;

      const { user } = response;

      dispatch(setUser({ user }));
      alert("Sign Up Successful!");

      // Clear form
      setSignUpFullName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpMessage("");

      navigate("/");

      window.location.reload(); // Reload to clear user state

      onClose(); // Close modal
    } catch (error) {
      console.error("❌ Sign Up Error:", error);
      if (error?.data?.message) {
        setSignUpMessage(error.data.message);
      } else {
        setSignUpMessage("Sign up failed. Try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-5xl">
        <div
          ref={modalRef}
          className={`containerCSS ${isRegister ? "active" : ""}`}
        >
          <button
            className="absolute top-4 right-4 text-3xl text-gray-300 hover:text-red-500 transition-colors duration-300 z-50"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaWindowClose />
          </button>

          {/* Background Shapes */}
          <div className="curved-shape"></div>
          <div className="curved-shape2"></div>

          {/* Sign In Form */}
          <div className="form-box Login">
            <h2 className="animation" style={{ "--D": 0, "--S": 21 }}>
              Sign In
            </h2>

            <form onSubmit={handleSignIn}>
              <div
                className="input-box animation"
                style={{ "--D": 1, "--S": 22 }}
              >
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                />
                <label>CUET Email</label>
                <i className="bx bxs-envelope" />
              </div>

              <div
                className="input-box animation relative"
                style={{ "--D": 2, "--S": 23 }}
              >
                <input
                  type={showSignInPassword ? "text" : "password"}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
                <label>Password</label>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                >
                  {showSignInPassword ? (
                    <i>
                      <FaEyeSlash />
                    </i>
                  ) : (
                    <i>
                      <FaEye />
                    </i>
                  )}
                </button>
              </div>

              <div
                className="input-box animation"
                style={{ "--D": 3, "--S": 24 }}
              >
                <button className="btnCSS" type="submit">
                  Sign In
                </button>
              </div>

              {signInMessage && (
                <div className="text-red-500 text-sm mt-10 text-center">
                  {signInMessage}
                </div>
              )}

              <div
                className="regi-link animation"
                style={{ "--D": 4, "--S": 25 }}
              >
                <p>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="SignUpLink"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRegister(true);
                      setSignInEmail("");
                      setSignInPassword("");
                      setSignInMessage("");
                    }}
                  >
                    Sign Up
                  </a>{" "}
                  here
                </p>
              </div>
            </form>
          </div>

          {/* Login Info Panel */}
          <div className="info-content Login">
            <h2 className="animation" style={{ "--D": 0, "--S": 20 }}>
              Welcome Back!
            </h2>
            <p className="animation" style={{ "--D": 1, "--S": 21 }}>
              Access your <b>CUET Trade & Lost-Found Portal</b> account to
              continue.
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="form-box Register">
            <h2 className="animation" style={{ "--li": 17, "--S": 0 }}>
              Sign Up
            </h2>

            <form onSubmit={handleSignUp}>
              <div
                className="input-box animation"
                style={{ "--li": 18, "--S": 1 }}
              >
                <input
                  type="text"
                  required
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                />
                <label>Full Name</label>
                <i className="bx bxs-user" />
              </div>

              <div
                className="input-box animation"
                style={{ "--li": 18, "--S": 1 }}
              >
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
                <label>CUET Email</label>
                <i className="bx bxs-envelope" />
              </div>

              <div
                className="input-box animation relative"
                style={{ "--li": 19, "--S": 2 }}
              >
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                />
                <label>Password</label>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                >
                  {showSignUpPassword ? (
                    <i>
                      <FaEyeSlash />
                    </i>
                  ) : (
                    <i>
                      <FaEye />
                    </i>
                  )}
                </button>
              </div>

              <div
                className="input-box animation"
                style={{ "--li": 20, "--S": 3 }}
              >
                <button className="btnCSS" type="submit">
                  Sign Up
                </button>
              </div>

              {signUpMessage && (
                <div className="text-red-500 text-sm mt-5 text-center">
                  {signUpMessage}
                </div>
              )}

              <div
                className="regi-link animation"
                style={{ "--li": 21, "--S": 4 }}
              >
                <p>
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="SignInLink"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRegister(false);
                      setSignUpEmail("");
                      setSignUpPassword("");
                      setSignUpFullName("");
                      setSignUpMessage("");
                    }}
                  >
                    Sign In
                  </a>{" "}
                  here
                </p>
              </div>
            </form>
          </div>

          {/* Register Info Panel */}
          <div className="info-content Register">
            <h2 className="animation" style={{ "--li": 17, "--S": 0 }}>
              Join Our Portal!
            </h2>
            <p className="animation" style={{ "--li": 18, "--S": 1 }}>
              Create your account to access the{" "}
              <b>CUET Trade & Lost-Found Portal</b> services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
