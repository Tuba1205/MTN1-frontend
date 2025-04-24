import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMessage.css"; 
import AdminSidebar from "../components/AdminSidebar"; 

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const adminId = localStorage.getItem("userId"); 
  
        if (!adminId) {
          console.error("❌ Admin ID is missing!");
          return;
        }
  
        const response = await axios.get(
          `http://localhost:4000/api/messages/get/${adminId}/admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        console.log("📩 Messages fetched:", response.data); 
        setMessages(response.data.messages);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
        setError(err.response?.data?.message || "Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMessages();
  }, []);
  
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <h2>Messages</h2>

        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Message</th>
                <th>Time</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  {/* Sender ID Show */}
                  <td>{msg.sender || "Unknown"}</td>

                  {/* Recipient ID Show */}
                  <td>{msg.recipient || "Unknown"}</td>

                  {/* Message Content */}
                  <td>{msg.message}</td>

                  {/* Timestamp Check */}
                  <td>{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "N/A"}</td>

                  {/* File Attachment Check */}
                  <td>
                    {msg.fileUrl && msg.fileUrl !== "null" ? (
                      <a href={`http://localhost:4000/${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
                        📎 View File
                      </a>
                    ) : (
                      "No Attachment"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
