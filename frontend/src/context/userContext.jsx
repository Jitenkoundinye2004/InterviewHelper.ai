import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPath.js";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading

  useEffect(() => {
    if (user) return;

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
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
},[]);

const updateUser =(userData)=>{
  if (userData && userData.token) {
    localStorage.setItem("token", userData.token);
  }
  setUser(userData); // This can be user object or null on logout
  if (loading) setLoading(false);
};


const clearUser=()=>{
    setUser(null);
    localStorage.removeItem("token");

};

return(
    <UserContext.Provider value={{user,loading,updateUser,clearUser}}>
        {children}
    </UserContext.Provider>
);
};

export default UserContextProvider;