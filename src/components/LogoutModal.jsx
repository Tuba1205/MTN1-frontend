import React from "react";
import Modal from "react-modal";
import "../styles/LogoutModal.css"; // Create this CSS file

// Set the app root to avoid accessibility issues
Modal.setAppElement("#root");

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="logout-modal"
      overlayClassName="logout-overlay"
    >
      <h2>Sign Out</h2>
      <p>Are you sure you want to logout?</p>
      <div className="logout-buttons">
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="logout-btn" onClick={onConfirm}>
          Logout
        </button>
      </div>
    </Modal>
  );
};

export default LogoutModal;
