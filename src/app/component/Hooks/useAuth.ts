import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check authentication token in cookies
  const checkAuth = useCallback(() => {
    const token = Cookies.get("token"); // Assuming your JWT token is stored as 'token'
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Effect to check authentication when the component using this hook mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated, checkAuth };
};

export default useAuth;
