import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TeacherBookings.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TeacherSidebar from "./TeacherSidebar";
import { format } from 'date-fns';

const TeacherBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newDay, setNewDay] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(""); // Store the selected slot ID
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  // Fetch bookings assigned to the teacher
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/teachers/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📢 API Response:", response.data);

      const formattedBookings = response.data.map(booking => ({
        ...booking,
        formattedStartTime: new Date(booking.startTime).toLocaleString(),
      }));

      setBookings(Array.isArray(formattedBookings) ? formattedBookings : []);
    } catch (error) {
      console.error("🚨 API Fetch Error:", error.response ? error.response.data : error.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch available slots when a day is selected
  useEffect(() => {
    if (selectedBooking && newDay) {
      fetchRescheduleSlots(selectedBooking, newDay);
    }
  }, [newDay]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch available slots for rescheduling
  const fetchRescheduleSlots = async (bookingId, selectedDate) => {
    try {
      // Ensure that selectedDate is a valid Date object
      if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        console.error("Invalid Date:", selectedDate);
        return;
      }

      // Get the day of the week from the selectedDate
      const day = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
      console.log(`📅 Fetching slots for Teacher ID: ${bookingId}, Day: ${day}`);

      const selectedBookingData = bookings.find(b => b._id === bookingId);
      if (!selectedBookingData) {
        alert("Booking not found!");
        return;
      }

      const teacherId = selectedBookingData.teacher;
      if (!teacherId) {
        alert("Error: Teacher ID is missing!");
        return;
      }

      // Make the API call to fetch available slots for the teacher on that day
      const res = await axios.get(
        `http://localhost:4000/api/admin/getTeacherAvailableSlots/${teacherId}/${day}`,
        { headers: getAuthHeaders() }
      );

      setAvailableSlots(res.data.availableSlots);
    } catch (error) {
      console.error("Error fetching reschedule slots:", error);
    }
  };



  // Format the selectedDate to yyyy-MM-dd if it is an instance of Date
  const formattedDate = selectedDate instanceof Date
    ? format(selectedDate, 'yyyy-MM-dd')
    : selectedDate;

    const rescheduleBooking = async (e) => {
      e.preventDefault();
    
      if (!selectedDate || !selectedSlotId) {
        alert("❌ Both date and slot are required.");
        return;
      }
    
      try {
        // Fetch the selected booking data from the bookings state
        const selectedBookingData = bookings.find(b => b._id === selectedBooking);
        
        if (!selectedBookingData) {
          console.error("Booking data not found!");
          return;
        }
    
        // Log the payload and headers to ensure everything is being sent correctly
        console.log("Request payload:", {
          selectedDate: formattedDate,
          selectedSlotId
        });
    
        // Log headers
        console.log("Authorization header:", getAuthHeaders());
    
        // Send the PUT request to reschedule the booking
        const response = await axios.put(
          `http://localhost:4000/api/bookings/${selectedBooking}/reschedule`,
          {
            selectedDate: formattedDate,  // Pass only the date and slot ID
            selectedSlotId,
            teacherId: selectedBookingData.teacher?._id // Pass teacherId from selectedBookingData
          },
          { headers: getAuthHeaders() } // Include auth headers with the token
        );
    
        // Success message on successful rescheduling
        alert("✅ Booking Rescheduled!");
        setSuccessMessage(response.data.message);
    
        // Refresh the bookings list after the booking is rescheduled
        await fetchBookings();
    
        // Close the modal and reset the form state
        setRescheduleModal(false);
        setSelectedBooking(null);
        setSelectedDate("");
        setSelectedSlotId("");
        setAvailableSlots([]);
      } catch (err) {
        console.error("Error rescheduling:", err);
        // Handle error if setError is not defined
        alert("Error rescheduling booking.");
      }
    };
    
  // Cancel Booking
  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found.");
        alert("You are not logged in. Please log in again.");
        return;
      }

      await axios.delete(`http://localhost:4000/api/bookings/${bookingId}/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBookings();
      alert("✅ Booking cancelled successfully!");
    } catch (error) {
      console.error("🚨 Error cancelling booking:", error.response ? error.response.data : error.message);
      alert("Failed to cancel. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedBooking && selectedDate instanceof Date && !isNaN(selectedDate)) {
      const formattedDay = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
      fetchRescheduleSlots(selectedBooking, selectedDate);
    } else if (selectedDate) {
      console.error("Invalid date selected:", selectedDate);
    }
  }, [newDay, selectedDate]);

  return (
    <div className="teacher-bookings">
      <TeacherSidebar />
      <h2>📅 Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={booking._id} className="booking-item">
                  <td>{booking.student?.name || "N/A"}</td>
                  <td>{formattedDate}</td>
                  <td>{booking.startTime}</td>
                  <td>40 mins</td>
                  <td>{booking.status}</td>
                  <td>
                    <button
                      className="reschedule-btn"
                      onClick={() => {
                        setSelectedBooking(booking._id);
                        setNewStartTime("");
                        setNewDay("");
                        setRescheduleModal(true);
                      }}
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && selectedBooking && (
        <div className="reschedule-container">
          <h3>Reschedule Booking</h3>

          {/* Calendar Component for Selecting Date */}
          <Calendar
            onChange={(date) => {
              console.log("Date selected:", date);
              // Ensure it's a valid date object
              if (date instanceof Date && !isNaN(date)) {
                setSelectedDate(date);
              } else {
                console.error("Invalid date selected:", date);
              }
            }}
            value={selectedDate}
          />

          {/* Fetch Available Slots Button */}
          <button onClick={() => fetchRescheduleSlots(selectedBooking)}>Check Available Slots</button>

          {/* Available Slots for Rescheduling */}
          {availableSlots.length > 0 && (
            <div className="slots-container">
              {availableSlots.map((slot, index) => {
                const slotData = slot._doc || slot;
                const isSelected = newStartTime === slotData.startTime;

                return (
                  <button
                    key={slotData._id || index}
                    className={`slot ${slotData.isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                    disabled={slotData.isBooked}
                    onClick={() => {
                      setNewStartTime(slotData.startTime);
                      setSelectedSlotId(slotData._id);  // Set selected slot ID here
                    }}
                  >
                    {slotData.startTime} - {slotData.endTime}
                  </button>
                );
              })}
            </div>
          )}

          {/* Reschedule Button */}
          <button onClick={rescheduleBooking} disabled={!newStartTime}>
            Reschedule
          </button>
        </div>
      )}

    </div>
  );
};

export default TeacherBookings;
