import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "../styles/styles.css"; // External CSS

const EmailAuth = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    // Validate email format
    if (email.includes("@") && email.includes(".")) {
      try {
        // Send OTP request to the backend API
        const response = await axios.post('http://localhost:4000/api/auth/send-otp', { email });
  
        // Handle response from the backend
        if (response.data.success) {
          // Save the email in localStorage to use it later for OTP verification
          localStorage.setItem("email", email);
  
          // OTP sent successfully, navigate to OTP verification page
          navigate("/otp-verification");
        } else {
          alert(response.data.message); // Show error message if OTP couldn't be sent
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("There was an error sending the OTP. Please try again later.");
      }
    } else {
      alert("Please enter a valid email address");
    }
  };
  

  return (
    <div className="page-container">
      <div className="auth-container">
        <h2>Register with Email</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
        <button className="btn" onClick={sendOTP}>Send OTP</button>
      </div>
    </div>
  );
};

export default EmailAuth;
