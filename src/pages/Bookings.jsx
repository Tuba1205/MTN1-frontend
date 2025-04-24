import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Sidebar component
import BookingForm from "../components/BookingForm";
import "../styles/Booking.css";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error.response?.data || error.message);
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="content">
        <h1>Your Bookings</h1>

        {/* Booking Form */}
        <BookingForm fetchBookings={fetchBookings} />

        {/* Loading & Error Messages */}
        {loading && <p>Loading bookings...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Booking List */}
        <div className="booking-list">
  {bookings.length === 0 && !loading && !error ? (
    <p>No bookings found.</p>
  ) : (
    bookings.map((booking) => {
      // Format the date here
      const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      return (
        <div key={booking._id} className="booking-item">
          <p><strong>Teacher:</strong> {booking.teacher?.name || "N/A"}</p>
          <p><strong>Start Time:</strong> {booking.startTime}</p>
          <p><strong>Duration:</strong> 40 mins</p>
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Status:</strong> {booking.status}</p>
        </div>
      );
    })
  )}
</div>

      </div>
    </div>
  );
};

export default Booking;
