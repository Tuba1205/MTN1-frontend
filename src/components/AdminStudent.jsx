import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminStudent.css"; // Ensure CSS file is correctly linked
import AdminSidebar from "../components/AdminSidebar"; // Ensure correct path

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token"); // Get stored admin token
        const response = await axios.get("https://mtn1-backend-production.up.railway.app/api/students/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <h2>All Students</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student._id}</td> {/* Student ID added */}
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
