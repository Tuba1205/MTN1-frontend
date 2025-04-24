import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousels";
import logo from "../assets/logo-MTN.jpg";
import "../styles/styles.css";  // Import CSS

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="left-section">
        <Carousel />
      </div>
      <div className="right-section">
        <img src={logo} alt="App Logo" className="app-logo" />
        <button className="btn" onClick={() => navigate("/email-auth")}>Continue as a Student</button>
        <button className="btn-outline" onClick={() => navigate("/employeelogin")}>Continue as an Employee</button>
      </div>
    </div>
  );
};

export default LandingPage;
