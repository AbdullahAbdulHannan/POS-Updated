import { jwtDecode } from "jwt-decode"; // ✅ Correct


export const checkTokenExpiry = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = auth?.token;
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("auth");
      window.location.href = "/login";
      return false;
    }
    return true;
  } catch (err) {
    console.error("Invalid token");
    localStorage.removeItem("auth");
    window.location.href = "/login";
    return false;
  }
};