import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/createUser.css";

const CreateUser = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="create-user-container">
        <h2>Create User</h2>
        <div className="user-cards">
          <div className="user-card" onClick={() => navigate("/admin/create-student")}>
            <h3>Create Student</h3>
            <p>Add a new student to the platform.</p>
          </div>
          <div className="user-card" onClick={() => navigate("/admin/create-teacher")}>
            <h3>Create Teacher</h3>
            <p>Add a new teacher to the platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
