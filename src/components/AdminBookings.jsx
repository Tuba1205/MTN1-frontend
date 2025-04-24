import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/AdminBookings.css";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

const AdminBooking = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStartTime, setNewStartTime] = useState("");
    const [status, setStatus] = useState("pending");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [bookingUpdates, setBookingUpdates] = useState({});
    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assignModal, setAssignModal] = useState(false);

    useEffect(() => {
        fetchTeachers();
        fetchStudents();
        fetchBookings();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    const fetchTeachers = async () => {
        try {
            const res = await axios.get("https://mtn1-backend-production.up.railway.app/api/admin/teachers", {
                headers: getAuthHeaders(),
            });
            setTeachers(res.data);
        } catch (error) {
            console.error("Error fetching teachers:", error.response?.data || error.message);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get("https://mtn1-backend-production.up.railway.app/api/admin/students", {
                headers: getAuthHeaders(),
            });
            setStudents(res.data);
        } catch (error) {
            console.error("Error fetching students:", error.response?.data || error.message);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get("https://mtn1-backend-production.up.railway.app/api/bookings", {
                headers: getAuthHeaders(),
            });
            setBookings(res.data);
        } catch (error) {
            console.error("Error fetching bookings:", error.response?.data || error.message);
        }
    };

    const fetchSlots = async () => {
        if (!selectedTeacher) {
            alert("Please select a teacher first.");
            return;
        }

        setLoading(true);
        const dayOfWeek = selectedDate.toLocaleString("en-US", { weekday: "long" }).toLowerCase(); // Get the day of the week from the selected date
        try {
            const res = await axios.get(
                `https://mtn1-backend-production.up.railway.app/api/admin/getTeacherAvailableSlots/${selectedTeacher}/${dayOfWeek}`,
                { headers: getAuthHeaders() }
            );

            console.log("Fetched Slots:", res.data);
            setAvailableSlots(res.data.availableSlots || []);
        } catch (error) {
            console.error("Error fetching slots:", error.response?.data || error.message);
        }
        setLoading(false);
    };
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

    const assignClass = async () => {
        if (!selectedStudent || !selectedTeacher || !selectedSlot || !selectedDate) {
            alert("Please select a student, teacher, date, and time slot.");
            return;
        }

        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD
        const dayOfWeek = getDayOfWeek(dateObj).charAt(0).toUpperCase() + getDayOfWeek(dateObj).slice(1);

        const payload = {
            studentId: selectedStudent,
            teacherId: selectedTeacher,
            date: formattedDate,
            day: dayOfWeek,
            slotId: selectedSlot._id,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
        };

        try {
            const res = await axios.post(
                "https://mtn1-backend-production.up.railway.app/api/admin/assign-class",
                payload,
                { headers: getAuthHeaders() }
            );
            console.log("✅ Class assigned:", res.data);
            alert("Class assigned successfully!");
            fetchBookings(); // Refresh booking list after assignment

             // Close the modal and reset the form state
        setAssignModal(false); // Close the modal
        setSelectedStudent(null);
        setSelectedTeacher(null);
        setSelectedSlot(null);
        setSelectedDate(null);
        } catch (err) {
            console.error("❌ Error assigning class:", err.response?.data || err.message);
            alert("Failed to assign class: " + (err.response?.data?.error || err.message));
        }
    };

    const fetchRescheduleSlots = async (bookingId, selectedDate) => {
        try {
          const selectedBookingData = bookings.find(b => b._id === bookingId);
          if (!selectedBookingData) {
            alert("Booking not found!");
            return;
          }
      
          const teacherId = selectedBookingData.teacher?._id;
          if (!teacherId) {
            alert("Error: Teacher ID is missing!");
            return;
          }
      
          const day = new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
          });
      
          console.log(`📅 Fetching slots for Teacher ID: ${teacherId}, Day: ${day}`);
      
          const res = await axios.get(
            `https://mtn1-backend-production.up.railway.app/api/admin/getTeacherAvailableSlots/${teacherId}/${day}`,
            { headers: getAuthHeaders() }
          );
      
          setAvailableSlots(res.data.availableSlots);
        } catch (error) {
          console.error("Error fetching reschedule slots:", error);
        }
      };
      
      const formattedDate = selectedDate instanceof Date
    ? format(selectedDate, 'yyyy-MM-dd')  // Keeps the date in local timezone
    : selectedDate;

const rescheduleBooking = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlotId) {
        setError("Both date and slot are required.");
        return;
    }

    try {
        const response = await axios.put(
            `https://mtn1-backend-production.up.railway.app/api/bookings/${selectedBooking}/reschedule`,
            {
                selectedDate: formattedDate,
                selectedSlotId,
            },
            { headers: getAuthHeaders() }
        );

        alert("Booking Rescheduled ✅");
        setSuccessMessage(response.data.message);

        // Refresh the list of bookings (if you have a fetchBookings function)
        await fetchBookings();

        // Close modal and reset state
        setRescheduleModal(false);
        setSelectedBooking(null);
        setSelectedDate("");
        setSelectedSlotId("");
        setAvailableSlots([]);
    } catch (err) {
        console.error("Error rescheduling:", err);
        setError("Error rescheduling booking.");
    }
};
    
    const openRescheduleModal = (bookingId) => {
        setSelectedBooking(bookingId);
        setRescheduleModal(true);
    };

    const closeRescheduleModal = () => {
        setRescheduleModal(false);
        setSelectedBooking(null);
        setAvailableSlots([]);
        setNewStartTime("");
    };

    const cancelBooking = async (bookingId) => {
        try {
            await axios.delete(
                `https://mtn1-backend-production.up.railway.app/api/bookings/${bookingId}/cancel`,
                { headers: getAuthHeaders() }
            );
            alert("Booking Cancelled ✅");
            fetchBookings();
        } catch (error) {
            console.error("Error cancelling booking:", error.response?.data || error.message);
        }
    };

    const updateBookingStatus = async (bookingId) => {
        if (!bookingUpdates[bookingId]?.status) {
            alert("Please select a status.");
            return;
        }

        try {
            await axios.put(
                "https://mtn1-backend-production.up.railway.app/api/admin/update-class-status",
                { bookingId, status: bookingUpdates[bookingId].status },
                { headers: getAuthHeaders() }
            );
            alert("Booking Status Updated ✅");
            fetchBookings();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) {
            return;
        }

        try {
            await axios.delete(
                `https://mtn1-backend-production.up.railway.app/api/bookings/${bookingId}/delete`,
                { headers: getAuthHeaders() }
            );
            alert("Booking Deleted ✅");

            // Refresh bookings after deletion
            fetchBookings();  // Re-fetch the bookings to reflect the deletion

        } catch (error) {
            console.error("Error deleting booking:", error.response?.data || error.message);
        }
    };


    const handleInputChange = (bookingId, field, value) => {
        setBookingUpdates(prev => ({
            ...prev,
            [bookingId]: { ...prev[bookingId], [field]: value }
        }));
    };


    return (
        <div className="booking-container">
            <h2>Assign Class</h2>

            {/* Calendar Component for Selecting Date */}
            <div className="calendar-container">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileDisabled={({ date }) => date.getDay() === 0} // 0 = Sunday
                />
            </div>

            <div className="dropdown-group">
                <select onChange={(e) => setSelectedTeacher(e.target.value)} value={selectedTeacher}>
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                </select>

                <button onClick={fetchSlots} disabled={!selectedTeacher}>
                    {loading ? "Loading..." : "Check Slots"}
                </button>
            </div>

            {availableSlots.length > 0 && (
                <div className="slots-container">
                    {availableSlots.map((slot, index) => {
                        const slotData = slot._doc || slot;
                        const isSelected = selectedSlot && selectedSlot.startTime === slotData.startTime;

                        return (
                            <button
                                key={slotData._id || index}
                                className={`slot ${slotData.isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                                disabled={slotData.isBooked}
                                onClick={() => setSelectedSlot(slotData)}
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

            <div className="dropdown-group">
                <select onChange={(e) => setSelectedStudent(e.target.value)} value={selectedStudent}>
                    <option value="">Select Student</option>
                    {students.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>
                <button onClick={assignClass} disabled={!selectedSlot}>Assign</button>
            </div>
            <h2>Manage Bookings</h2>
            <div className="booking-list">
  {bookings.map((booking) => {
    // Format date safely (in case backend sends raw Date)
    const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    return (
      <div key={booking._id} className="booking-item">
        <p>
          <strong>Student:</strong> {booking.student?.name} | 
          <strong> Teacher:</strong> {booking.teacher?.name} |  
          <strong> Date:</strong> {formattedDate} | 
          <strong> Time:</strong> {booking.startTime} - {booking.endTime} | 
          <strong> Status:</strong> {booking.status}
        </p>
        <button onClick={() => openRescheduleModal(booking._id)}>Reschedule</button>
        <button onClick={() => cancelBooking(booking._id)} className="cancel-btn">Cancel</button>
        <button onClick={() => deleteBooking(booking._id)} className="delete-btn">Delete</button>
      </div>
    );
  })}
                {rescheduleModal && (
  <div className="reschedule-container">
    <h3>Reschedule Booking</h3>

    {/* Calendar Component for Selecting Date */}
    <Calendar
      onChange={(date) => setSelectedDate(date)}
      value={selectedDate}
    />

    <button onClick={() => fetchRescheduleSlots(selectedBooking, selectedDate)}>
      Check Available Slots
    </button>

    {/* Available Slots for Rescheduling */}
    {availableSlots.length > 0 && (
      <div className="slots-container">
        {availableSlots.map((slot, index) => {
          const slotData = slot._doc || slot;
          const isSelected = selectedSlotId === slotData._id; // 🔄 use slotId for selection

          return (
            <button
              key={slotData._id || index}
              className={`slot ${slotData.isBooked ? "booked" : isSelected ? "selected" : "available"}`}
              disabled={slotData.isBooked}
              onClick={() => {
                setNewStartTime(slotData.startTime);             // ✅ keep this if you show time somewhere
                setSelectedSlotId(slotData._id);                 // ✅ this is the critical fix
              }}
            >
              {slotData.startTime} - {slotData.endTime}
            </button>
          );
        })}
      </div>
    )}

    {/* Reschedule Button */}
    <button onClick={rescheduleBooking} disabled={!selectedSlotId}>
      Reschedule
    </button>

    {/* Close Button */}
    <button onClick={closeRescheduleModal}>Close</button>
  </div>
)}


<div className="booking-list">
  {bookings.map((booking) => {
    const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    return (
      <div key={booking._id} className="booking-item">
        <p>
          <strong>Student:</strong> {booking.student?.name} | 
          <strong> Teacher:</strong> {booking.teacher?.name} | 
          <strong> Date:</strong> {formattedDate} | 
          <strong> Time:</strong> {booking.startTime} - {booking.endTime} | 
          <strong> Status:</strong> {bookingUpdates[booking._id]?.status || booking.status}
        </p>

        <select
          value={bookingUpdates[booking._id]?.status || booking.status}
          onChange={(e) => handleInputChange(booking._id, "status", e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={() => updateBookingStatus(booking._id)}>Update Status</button>
      </div>
    );
  })}
</div>

            </div>



            {/* Back to Dashboard Button */}
            <div className="back-to-dashboard-container">
                <button className="back-to-dashboard-btn" onClick={() => navigate("/dashboard/admin")}>
                    ⬅ Back to Dashboard
                </button>
            </div>

        </div>
    );
};

export default AdminBooking;
