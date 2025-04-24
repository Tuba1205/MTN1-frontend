import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminTimeSlotManagement.css";
import AdminSidebar from "../components/AdminSidebar";

const TeacherSlots = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });

    useEffect(() => {
        fetchTeachers();
    }, []);

    // ✅ Fetch Teachers
    const fetchTeachers = async () => {
        try {
            const response = await axios.get("https://mtn1-backend-production.up.railway.app/api/admin/teachers");
            setTeachers(response.data);
        } catch (error) {
            console.error("❌ Error fetching teachers:", error);
        }
    };

    // ✅ Fetch Available Slots
    const fetchAvailableSlots = async () => {
        if (!selectedTeacher || !selectedDay) {
            console.warn("⚠️ Select both a teacher and a day before fetching slots.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized! Please log in again.");
                return;
            }

            const response = await axios.get(
                `https://mtn1-backend-production.up.railway.app/api/admin/getTeacherAvailableSlots/${selectedTeacher}/${selectedDay}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("✅ Available Slots:", response.data);
            setAvailableSlots(response.data.availableSlots || []);
        } catch (error) {
            console.error("❌ Error fetching slots:", error);
            alert("Failed to fetch available slots.");
        }
    };

    // ✅ Fetch slots when teacher or day changes
    useEffect(() => {
        if (selectedTeacher && selectedDay) {
            fetchAvailableSlots();
        }
    }, [selectedTeacher, selectedDay]);

    // ✅ Assign a Slot
    const handleAssignSlot = async () => {
        if (!selectedTeacher || !selectedDay || !newSlot.startTime || !newSlot.endTime) {
            alert("❌ Please select a teacher, day, and enter valid slot times.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized! Please log in again.");
                return;
            }

            const response = await axios.post(
                "https://mtn1-backend-production.up.railway.app/api/admin/assignslot",
                {
                    teacherId: selectedTeacher,
                    day: selectedDay,
                    slots: [{ startTime: newSlot.startTime, endTime: newSlot.endTime }],
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Slot Assigned:", response.data);
            alert("Slot assigned successfully!");
            setNewSlot({ startTime: "", endTime: "" }); // Reset input fields
            fetchAvailableSlots();
        } catch (error) {
            console.error("❌ Error assigning slot:", error);
            alert(error.response?.data?.message || "Failed to assign slot.");
        }
    };

    // ✅ Delete a Slot
    const handleDeleteSlot = async (startTime) => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("Unauthorized: No token found. Please log in again.");
            return;
          }
      
          // 🔍 Debugging Logs: Check Values Before API Call
          console.log("🛠️ Deleting Slot - Selected Data:", {
            teacherId: selectedTeacher,
            day: selectedDay,
            startTime,
          });
      
          if (!selectedTeacher || !selectedDay || !startTime) {
            alert("❌ Missing required fields. Please select teacher and day.");
            return;
          }
      
          // ✅ Send API Request
          const response = await axios.delete("https://mtn1-backend-production.up.railway.app/api/admin/deleteslot", {
            data: { teacherId: selectedTeacher, day: selectedDay, startTime }, // 👈 Data as body
            headers: { Authorization: `Bearer ${token}` },
          });
      
          console.log("✅ Slot Deleted:", response.data);
          alert("Slot deleted successfully!");
          fetchAvailableSlots(selectedTeacher, selectedDay); // Refresh list
        } catch (error) {
          console.error("❌ Error deleting slot:", error.response?.data || error);
          alert(error.response?.data?.message || "Failed to delete slot.");
        }
      };
      
      

    return (
        <div className="container">
            <AdminSidebar />
            <h2>Teacher Slot Management</h2>

            {/* ✅ Teacher Selection */}
            <label>Select Teacher:</label>
            <select onChange={(e) => setSelectedTeacher(e.target.value)}>
                <option value="">-- Select a Teacher --</option>
                {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                    </option>
                ))}
            </select>

            {/* ✅ Day Selection */}
            <label>Select Day:</label>
            <select onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="">-- Select a Day --</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <option key={day} value={day}>
                        {day}
                    </option>
                ))}
            </select>

            {/* ✅ Add New Slot */}
            <div className="slot-inputs">
                <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
                <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
                <button onClick={handleAssignSlot}>➕ Add Slot</button>
            </div>

            {/* ✅ Display Available Slots */}
            {selectedTeacher && selectedDay && (
                <>
                    <h3>Available Slots for {selectedDay}</h3>
                    <div className="slots-container">
                        {availableSlots.length > 0 ? (
                            availableSlots.map((slot, index) => {
                                // ✅ Convert Mongoose Document to Plain Object
                                const slotData = slot._doc || slot;

                                console.log(`🎯 Rendering Slot #${index + 1}:`, slotData); // Debugging line

                                return (
                                    <div key={slotData._id || index} className={`slot ${slotData.isBooked ? "booked" : "available"}`}>
                                        {/* ✅ Ensure that startTime and endTime exist */}
                                        <span>
                                            {slotData.startTime && slotData.endTime ? (
                                                `${slotData.startTime} - ${slotData.endTime}`
                                            ) : (
                                                "❌ No Time Available"
                                            )}
                                        </span>
                                        {/* ❌ Delete Button */}
                                        {!slotData.isBooked && (
                                            <button className="delete-btn" onClick={() => handleDeleteSlot(slotData.startTime)}>
                                                ❌ Delete
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>No available slots.</p>
                        )}
                    </div>



                </>
            )}
        </div>
    );
};

export default TeacherSlots;
