import React, { useEffect, useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import "../styles/TeacherDashboard.css"; // Import the external CSS file

const TeacherDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing!");

        const response = await fetch("http://localhost:4000/api/teachers/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch bookings. Please try again!");

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <div className="main-content">
        <h1>📚 Welcome to Teacher Dashboard</h1>

        {/* 🔄 Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading upcoming classes...</p>
          </div>
        )}

        {/* ❌ Error State */}
        {error && (
          <div className="error-card">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* 📅 Upcoming Classes Section */}
        <div className="class-container">
          <h2>📅 Your Upcoming Classes</h2>
          {bookings.length === 0 && !loading && !error ? (
            <p>No upcoming classes scheduled.</p>
          ) : (
            <div className="class-grid">
              {bookings.map((booking) => {
                const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div key={booking._id} className="class-card">
                    <h3>👨‍🎓 {booking.student?.name || "Unknown Student"}</h3>
                    <p>📅 Date: {formattedDate}</p>
                    <p>⏰ Start Time: {booking.startTime}</p>
                    <p>📝 Status: {booking.status}</p>
                  </div>
                );
              })}
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
