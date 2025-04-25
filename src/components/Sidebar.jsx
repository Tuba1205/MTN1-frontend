import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaComments, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import LogoutModal from "./LogoutModal";
import "../styles/Sidebar.css";
import logo from "../assets/logo-MTN.jpg";

const Sidebar = () => {
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setLoggedInUserId(userId);
  }, []);

  const handleLogout = () => {
    setLogoutOpen(false);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger Button (Visible on Small Screens) */}
      <div className="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-logo-container">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>

        <NavLink to="/dashboard/student" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaHome className="sidebar-icon" /> Dashboard
        </NavLink>

        <NavLink to="/bookings" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaCalendarAlt className="sidebar-icon" /> Bookings
        </NavLink>

        {loggedInUserId ? (
          <NavLink to={`/chat/${loggedInUserId}/default`} className={({ isActive }) => (isActive ? "active" : "")}>
            <FaComments className="sidebar-icon" /> Messages
          </NavLink>
        ) : (
          <div className="sidebar-disabled">
            <FaComments className="sidebar-icon" /> Messages
          </div>
        )}

        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaUser className="sidebar-icon" /> Profile
        </NavLink>

        <button className="logout" onClick={() => setLogoutOpen(true)}>
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </button>

        <LogoutModal
          isOpen={isLogoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </>
  );
};

export default Sidebar;
