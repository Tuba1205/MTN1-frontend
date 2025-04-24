import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateTeacher.css";
import { useNavigate } from "react-router-dom";

const CreateTeacher = () => {

    const navigate = useNavigate();
    const [teacherData, setTeacherData] = useState({
        name: "",
        email: "",
        password: "",
        subject: "",
        phoneNumber: "",
    });

    const handleChange = (e) => {
        setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("✅ Form Submitted!"); // Debugging log

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No Token Found!");
                alert("Unauthorized: Please log in again.");
                return;
            }

            console.log("📌 Token:", token);

            const response = await axios.post(
                "http://localhost:4000/api/admin/create-teacher",
                teacherData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ API Response:", response.data);
            alert("Teacher created successfully!");

        } catch (error) {
            console.error("❌ API Error:", error.response?.data || error);
            alert("Failed to create teacher. Please try again.");
        }
    };



    return (
        <div className="form-container">
            <h2>Create Teacher</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
                <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
                <button type="submit">Create Teacher</button>
            </form>
            {/* Back to Dashboard Button */}
            <div className="back-to-dashboard-container">
                <button className="back-to-dashboard-btn" onClick={() => navigate("/admin/createuser")}>
                    ⬅ Back to Create User
                </button>
            </div>
        </div>
    );
};

export default CreateTeacher;
