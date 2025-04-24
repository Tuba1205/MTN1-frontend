import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Sidebar for navigation
import "../styles/TeacherList.css"; // Import CSS for styling

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://mtn1-backend-production.up.railway.app/api/teachers/all");
      setTeachers(response.data);
    } catch (err) {
      setError("Failed to load teachers.");
      console.error("Error fetching teachers:", err);
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
        <h1>📚 All Teachers</h1>

        {/* Loading & Error Handling */}
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* Teachers List */}
        <div className="teachers-list">
          {!loading && teachers.length === 0 ? (
            <p>No teachers found.</p>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher._id} className="teacher-card">
                <h3>👩‍🏫 {teacher.name}</h3>
                <p><strong>🆔 ID:</strong> {teacher._id}</p>
                <p><strong>📖 Subject:</strong> {teacher.subject}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersList;
