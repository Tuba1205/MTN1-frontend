import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "../styles/styles.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Handle OTP Input Change
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace for Navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP and Navigate
  const verifyOTP = async () => {
    const enteredOTP = otp.join("");
    console.log("Entered OTP:", enteredOTP); // Log the OTP to ensure it's correct
  
    if (enteredOTP.length === 6) {
      try {
        // Get the email from localStorage (you could also pass it via state, context, or props)
        const email = localStorage.getItem("email"); 
  
        if (!email) {
          alert("Email not found. Please try again.");
          return;
        }
  
        console.log("Sending OTP verification request for email:", email);
  
        // Verify OTP request to backend API
        const response = await axios.post('http://localhost:4000/api/auth/verify-otp', {
          email,    // Include email in the request body
          otp: enteredOTP // Send the OTP entered by the user
        });
  
        if (response.data.success) {
          // OTP verified successfully, redirect to login page
          navigate("/login");
        } else {
          alert(response.data.message); // Show error if verification fails
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("There was an error verifying the OTP. Please try again.");
      }
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };
  
  

  return (
    <div className="page-container">
      <div className="auth-container">
        <h2>Enter Verification Code</h2>
        <p>We have sent a 6-digit code to your email</p>

        {/* OTP Input Boxes */}
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input"
            />
          ))}
        </div>

        <button className="btn" onClick={verifyOTP}>Verify</button>
        <p className="link">Didn't receive a code? <span>Resend</span></p>
      </div>
    </div>
  );
};

export default OTPVerification;
