import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaComments, FaUser, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import LogoutModal from "./LogoutModal";  // Make sure this is the correct import path
import "../styles/Sidebar.css"; // Ensure your CSS path is correct
import logo from "../assets/logo-MTN.jpg";  // Replace with your actual logo path

const Sidebar = () => {
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();  // To navigate to login after logout

  // Fetch userId from localStorage on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage:", userId);  // Debugging
    setLoggedInUserId(userId);
  }, []);  // Empty dependency array ensures it only runs once

  // Handle logout by clearing localStorage and navigating to the login page
  const handleLogout = () => {
    setLogoutOpen(false);  // Close the modal
    localStorage.clear();  // Clear user data from localStorage
    navigate("/login");  // Redirect to login page using React Router's navigate
  };

  return (
    <div className="sidebar">
      {/* Sidebar Logo */}
      <div className="sidebar-logo-container">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>

      {/* Dashboard Link */}
      <NavLink to="/dashboard/student" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaHome className="sidebar-icon" /> Dashboard
      </NavLink>

      {/* Bookings Link */}
      <NavLink to="/bookings" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaCalendarAlt className="sidebar-icon" /> Bookings
      </NavLink>

      {/* Messages Link (Only accessible if user is logged in) */}
      {loggedInUserId ? (
        <NavLink to={`/chat/${loggedInUserId}/default`} className={({ isActive }) => (isActive ? "active" : "")}>
          <FaComments className="sidebar-icon" /> Messages
        </NavLink>
      ) : (
        <div className="sidebar-disabled">
          <FaComments className="sidebar-icon" /> Messages (You must be logged in)
        </div>
      )}

      {/* Profile Link */}
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaUser className="sidebar-icon" /> Profile
      </NavLink>

      {/* Analytics Link */}
      {/* <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaChartBar className="sidebar-icon" /> Analytics
      </NavLink> */}

      {/* Logout Button */}
      <button className="logout" onClick={() => setLogoutOpen(true)}>
        <FaSignOutAlt className="sidebar-icon" /> Logout
      </button>

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
