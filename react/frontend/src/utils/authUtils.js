import jwt_decode from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    const expiry = decoded.exp * 1000; // convert to ms
    return Date.now() > expiry;
  } catch (error) {
    return true; // Treat decode errors as expired
  }
};
