import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminTeacher.css"; // Add CSS file for styling
import AdminSidebar from "../components/AdminSidebar";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("adminToken"); // Assuming admin token is stored
        const response = await axios.get("https://mtn1-backend-production.up.railway.app/api/teachers/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(response.data);
      } catch (err) {
        setError("Failed to fetch teachers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-teachers">
        <h2>All Teachers</h2>

        {loading ? (
          <p>Loading teachers...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher._id}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminTeachers;
