import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css"; // Import CSS file
import LogoutModal from "./LogoutModal";
import logo from "../assets/logo-MTN.jpg";  // Replace with your actual logo path

const Sidebar = () => {
  const [isLogoutOpen, setLogoutOpen] = useState(false); // State for logout modal

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove authentication token
    window.location.href = "/employeelogin"; // Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo-container">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <ul>
        <li>
          <NavLink to="/dashboard/admin" activeclassname="active">
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/bookings" activeclassname="active">
            📅 Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/students" activeclassname="active">
            👨‍🎓 Students
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/teachers" activeclassname="active">
            👨‍🏫 Teachers
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/messages" activeclassname="active">
            💬 Messages
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/createuser" activeclassname="active">
            ➕ Create User
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/timeslots" activeclassname="active">
            ⏳ Manage Slots
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/sendmessage" activeclassname="active">
          💬 Send Message
          </NavLink>
        </li>

      </ul>
      <button className="logout-button" onClick={() => setLogoutOpen(true)}>🚪 Logout</button>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setLogoutOpen(false)}  // Close modal without logging out
        onConfirm={handleLogout}  // Confirm logout and clear localStorage
      />
    </div>
  );
};

export default Sidebar;
