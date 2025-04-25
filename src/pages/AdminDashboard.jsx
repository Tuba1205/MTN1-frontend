import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar"; // Import Sidebar component
import "../styles/AdminDashboard.css"; // Ensure this CSS file exists

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Admin token
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await axios.get("https://mtn1-backend-production.up.railway.app/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar */}
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
          <div className="card">
            <h3>Total Teachers</h3>
            <p>{stats.totalTeachers}</p>
          </div>
          <div className="card">
            <h3>Total Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
