// StudentDashboard.jsx
import React from "react";
import "../styles/StudentDashboard.css";
import DashboardLayout from "../components/DashboardLayout";
import UpcomingBookings from "../components/UpcomingBookings";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="student-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <h2>Welcome, Student</h2>
          <p className="dashboard-welcome-message">Here’s a summary of your activities.</p>
        </div>

        {/* Upcoming Classes Section */}
        <div className="section upcoming-classes">
          <UpcomingBookings />
        </div>

        {/* View Teacher Profiles */}
        <div className="teacher-profile-card">
           <h3>🔍 Find Your Teacher</h3>
          <p>Browse through experienced teachers and book your next class.</p>
           <button className="view-teachers-btn" onClick={() => navigate("/teachers")}>
           View Teachers
            </button>
        </div>


        {/* Booking Stats */}
        {/* <div className="section booking-stats">
          <h3>Booking Stats</h3>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Total Classes:</span> <span>0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed:</span> <span>0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Canceled:</span> <span>0</span>
            </div>
          </div>
        </div> */}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
