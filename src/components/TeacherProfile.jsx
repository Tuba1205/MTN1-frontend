import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TeacherProfile.css"; // Create a CSS file for styling
import TeacherSidebar from "../components/TeacherSidebar";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    bio: "",
  });

  // Fetch teacher profile
  const fetchProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No authentication token found.");
            alert("Unauthorized! Please login again.");
            return;
        }

        const response = await axios.get("http://localhost:4000/api/teachers/profile", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setTeacher(response.data);
        setFormData(response.data);
    } catch (error) {
        console.error("🚨 Error fetching profile:", error.response ? error.response.data : error.message);
        alert("Unauthorized! Please login again.");
    } finally {
        setLoading(false);  // ✅ Ensure loading is set to false after request
    }
};



  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      const response = await axios.put("http://localhost:4000/api/teachers/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeacher(response.data);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("🚨 Error updating profile:", error.response ? error.response.data : error.message);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="teacher-profile">
        <TeacherSidebar />
      <h2>👨‍🏫 Teacher Profile</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : teacher ? (
        <div className="profile-container">
          {editMode ? (
            <div className="edit-form">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />

              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly />

              <label>Subject:</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} readOnly />

              <label>Phone Number:</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} readOnly />

              <button onClick={handleUpdate} className="save-btn">Save</button>
              <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
            </div>
          ) : (
            <div className="profile-details">
              <p><strong>Name:</strong> {teacher.name}</p>
              <p><strong>Email:</strong> {teacher.email}</p>
              <p><strong>Subject:</strong> {teacher.subject}</p>
              <p><strong>Phone Number:</strong> {teacher.phoneNumber}</p>

              <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
            </div>
          )}
        </div>
      ) : (
        <p>❌ Profile not found.</p>
      )}
    </div>
  );
};

export default TeacherProfile;
