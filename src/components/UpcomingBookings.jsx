import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpcomingBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
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

      const now = Date.now();

      const futureBookings = response.data
        .map((booking) => {
          let fullDate;

          // Check if date string is a valid full date or just yyyy-mm-dd
          if (booking.date.includes("GMT")) {
            fullDate = new Date(booking.date);
          } else {
            fullDate = new Date(`${booking.date} ${booking.startTime}`);
          }

          if (isNaN(fullDate.getTime())) return null;

          return {
            ...booking,
            fullStartTime: fullDate.getTime(),
          };
        })
        .filter((booking) => booking && booking.fullStartTime > now)
        .sort((a, b) => a.fullStartTime - b.fullStartTime);

      setBookings(futureBookings);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      setError(error.response?.data?.message || "Failed to fetch upcoming bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upcoming-bookings">
      <h3>📅 Upcoming Classes</h3>

      {loading && <p>Loading upcoming classes...</p>}
      {error && <p className="error-message">{error}</p>}

      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const dateObj = new Date(booking.fullStartTime);

          const formattedDate = dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const formattedTime = dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={booking._id} className="booking-item">
              <p><strong>👩‍🏫 Teacher:</strong> {booking.teacher?.name || "N/A"}</p>
              <p><strong>📅 Date:</strong> {formattedDate}</p>
              <p><strong>⌛ Time:</strong> {formattedTime}</p>
            </div>
          );
        })
      ) : (
        <p>No upcoming classes. 📖 Book one now!</p>
      )}
    </div>
  );
};

export default UpcomingBookings;
