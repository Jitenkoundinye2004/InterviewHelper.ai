import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPath.js";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("Authentication failed:", error.response?.status, error.response?.data?.message || error.message);
        // Only clear user if it's an auth error (401)
        if (error.response?.status === 401) {
          clearUser();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

const updateUser = (userData) => {
  if (userData && userData.token) {
    localStorage.setItem("token", userData.token);
  }
  setUser(userData);
  if (loading) setLoading(false);
};

const clearUser = () => {
  setUser(null);
  localStorage.removeItem("token");
};

return (
  <UserContext.Provider value={{ user, loading, updateUser, clearUser, setUser }}>
    {children}
  </UserContext.Provider>
);
};

export default UserContextProvider;