// DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/DashboardLayout.css"; // Make sure this path is correct

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
