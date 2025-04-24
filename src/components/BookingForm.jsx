import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Booking.css";

const BookingForm = ({ fetchBookings }) => {
  const [teacherId, setTeacherId] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId") || localStorage.getItem("userId")); // Track studentId in state

  // This function gets the auth headers from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch available slots from backend
  const fetchAvailableSlots = async () => {
    if (!teacherId) {
      alert("Please select a teacher first.");
      return;
    }

    setLoading(true);
    const dayOfWeek = selectedDate.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
    try {
      const res = await axios.get(
        `https://mtn1-backend-production.up.railway.app/api/admin/getTeacherAvailableSlots/${teacherId}/${dayOfWeek}`,
        { headers: getAuthHeaders() }
      );

      console.log("Fetched Slots:", res.data);
      setAvailableSlots(res.data.availableSlots || []);
      // Preserve the selected slot if it exists after new fetch
      if (selectedSlot && !res.data.availableSlots.some(slot => slot._id === selectedSlot._id)) {
        setSelectedSlot(null); // Reset the selected slot if it's not available
      }
    } catch (error) {
      console.error("Error fetching slots:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  // Fetch slots whenever teacher or selected date changes
  useEffect(() => {
    if (teacherId && selectedDate) {
      fetchAvailableSlots();
    }
  }, [teacherId, selectedDate]); // Only re-fetch when teacher or date changes

  // Function to handle booking submission
  const handleStudentBooking = async () => {
    if (!studentId) {
      alert("Please log in as a student.");
      return; // Prevent submission if student is not logged in
    }
  
    if (!teacherId || !selectedSlot || !selectedDate) {
      alert("Please select a teacher, date, and time slot.");
      return;
    }
  
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString("en-CA"); // Format the date as 'YYYY-MM-DD'
  
    const payload = {
      studentId: studentId,  // Ensure studentId is passed here
      teacherId: teacherId,
      selectedSlotId: selectedSlot._id,
      selectedDate: formattedDate, // Only include selectedDate
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const res = await axios.post(
        "https://mtn1-backend-production.up.railway.app/api/bookings/create",
        payload,
        { headers: getAuthHeaders() }
      );
      console.log("✅ Booking Successful:", res.data);
      alert("Booking Successful!");
      fetchBookings(); // Refresh the booking list after successful booking
  
      // Reset the form after successful booking
      setTeacherId("");
      setSelectedSlot(null);
      setSelectedDate(null);
  
      // Refresh the page or reset the component state only after the alert is closed
      window.location.reload(); // This will reload the page and reset everything
    } catch (err) {
      console.error("❌ Booking Error:", err.response?.data || err.message);
      alert("Failed to create booking: " + (err.response?.data?.error || err.message));
    }
  };

  // Helper function to get the day of the week
  const getDayOfWeek = (date) => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  };

  useEffect(() => {
    console.log("Student ID from state:", studentId);
  }, [studentId]);

  return (
    <div className="booking-form">
      <h2>Book a Class</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleStudentBooking(); }}>
        {/* Display the Student ID in a non-editable field */}
        <label>Student ID:</label>
        {studentId ? (
          <p> {studentId}</p> // Or any other UI you want to show when logged in
        ) : (
          <p>You are not logged in</p>
        )}

        <label>Teacher ID:</label>
        <input
          type="text"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          required
        />

        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate} // Update selectedDate on calendar change
            value={selectedDate}
            minDate={new Date()} // Disable past dates
          />
        </div>

        {loading && <p>Loading available slots...</p>}

        {availableSlots.length > 0 && (
          <div className="slots-container">
            {availableSlots.map((slot, index) => {
              const slotData = slot._doc || slot; // Ensure compatibility with Mongoose Document
              const isSelected = selectedSlot && selectedSlot._id === slotData._id;

              return (
                <button
                  key={slotData._id || index}
                  className={`slot ${slotData.isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                  disabled={slotData.isBooked} // Prevent selection of booked slots
                  onClick={() => {
                    setSelectedSlot(slotData); // Select the slot on click
                    console.log("Selected Slot: ", slotData); // Debug selected slot
                  }}
                >
                  {slotData.startTime && slotData.endTime ? (
                    `${slotData.startTime} - ${slotData.endTime}`
                  ) : (
                    "❌ No Time Available"
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button type="submit" disabled={!selectedSlot}>Book Now</button>
      </form>
    </div>
  );
};

export default BookingForm;
