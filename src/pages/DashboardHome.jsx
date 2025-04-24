import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import "../styles/DashboardHome.css";

const DashboardHome = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        {/* Temporary Role Selection for Frontend Development */}
        {!role ? (
          <div className="role-selection">
            <h2>Select a Role</h2>
            <button onClick={() => setRole("admin")}>Admin</button>
            <button onClick={() => setRole("teacher")}>Teacher</button>
            <button onClick={() => setRole("student")}>Student</button>
          </div>
        ) : (
          <>
            {role === "admin" && <AdminDashboard />}
            {role === "teacher" && <TeacherDashboard />}
            {role === "student" && <StudentDashboard />}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
