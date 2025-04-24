import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateStudent.css";
import { useNavigate } from "react-router-dom";

const CreateStudent = () => {

    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    const [loading, setLoading] = useState(false); // Handle button loading state

    const handleChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
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
                "https://mtn1-backend-production.up.railway.app/api/admin/create-student",
                studentData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ API Response:", response.data);
            alert("Student created successfully!");

        } catch (error) {
            console.error("❌ API Error:", error.response?.data || error);
            alert("Failed to create student");
        }
    };

    return (
        <div className="form-container">
            <h2>Create Student</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={studentData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={studentData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={studentData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={studentData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Student"}
                </button>
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

export default CreateStudent;
