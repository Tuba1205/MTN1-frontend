import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EmployeeLogin.css"; // Import external CSS

const EmployeeLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        try {
            const response = await axios.post("https://mtn1-backend-production.up.railway.app/api/auth/login", { email, password });

            const { token, role, userId } = response.data;

            // Store user data in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);

            // Redirect based on role
            if (role === "admin") {
                navigate("/dashboard/admin");
            } else if (role === "teacher") {
                navigate("/dashboard/teacher");
            } else {
                navigate("/dashboard/student");
            }
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Employee Login</h2>
                
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin;
