import React, { useContext } from "react";
import { UserContext } from "../../context/userContext"; // make sure this path matches your folder
import Navbar from "./Navbar"; // adjust path if Navbar is elsewhere

const DashboardLayout = ({ children }) => {
  // Safe context access
  const context = useContext(UserContext) || {};
  const user = context.user;

  return (
    <div>
      <Navbar /> 
      {user ? (
        <div>{children}</div>
      ) : (
        <div className="p-4 text-center">Loading user data...</div>
      )}
    </div>
  );// src/components/layouts/DashboardLayout.jsx

};

export default DashboardLayout;
