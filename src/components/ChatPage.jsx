import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getMessages, sendMessage, getChatUsers } from "../utilis/api";
import "../styles/ChatPage.css";
import "../styles/Sidebar.css";

// ✅ WebSocket Connection
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", {
  transports: ["websocket"],
});

const ChatPage = () => {
  const { userId, recipientId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Check Login Status
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    if (!storedUserId || !storedRole) {
      navigate("/login");
      return;
    }
    setRole(storedRole);
  }, [navigate]);

  // ✅ Get Chat Users
  useEffect(() => {
    if (!userId || !role) return;
    const fetchUsers = async () => {
      try {
        const users = await getChatUsers(userId, role);
        console.log("✅ Fetched Users from API:", users); // Debugging
    
        if (Array.isArray(users) && users.length > 0) {
          setChatUsers(users);
          const recipient = users.find((user) => user._id === recipientId);
          if (recipient) {
            setRecipientName(recipient.name);
          } else {
            console.warn("⚠️ Recipient not found in users list!");
          }
        } else {
          console.warn("⚠️ No chat users found!");
        }
      } catch (error) {
        console.error("❌ Error fetching chat users:", error);
      }
    };
    fetchUsers();
  }, [userId, role, recipientId]);
  

  // ✅ Get Messages
  useEffect(() => {
    if (!userId || !recipientId || recipientId === "default") return;

    const fetchMessages = async () => {
      try {
        const response = await getMessages(userId, recipientId);

        if (Array.isArray(response.messages)) {
          // ✅ Filter messages to ensure only relevant chats are shown
          const filteredMessages = response.messages.filter(
            (msg) =>
              (msg.sender === userId && msg.recipient === recipientId) ||
              (msg.sender === recipientId && msg.recipient === userId)
          );

          setMessages(filteredMessages);
          setTimeout(() => scrollToBottom(), 300);
        }
      } catch (error) {
        console.error("❌ Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [userId, recipientId]);
  
  
  // ✅ Socket.io - Listen for new messages
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log("📩 Received Message:", newMessage); // ✅ Debugging
      if (!newMessage || !newMessage.sender || !newMessage.recipient) return;

      if (
        (newMessage.sender === userId && newMessage.recipient === recipientId) ||
        (newMessage.sender === recipientId && newMessage.recipient === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.emit("joinChat", { userId, recipientId });

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.emit("leaveChat", { userId, recipientId });
    };
  }, [userId, recipientId]);
  useEffect(() => {
    console.log("🟢 Current User ID:", userId);
    console.log("🟢 Current Recipient ID:", recipientId);
}, [userId, recipientId]);


  // ✅ Send Message Function
  const handleSendMessage = async () => {
    if (!message.trim() && !file) {
      alert("⚠️ Message cannot be empty and no file attached.");
      return;
    }
  
    if (!recipientId || recipientId === "default") {
      alert("⚠️ Please select a recipient.");
      return;
    }
  
    // OPTIONAL FRONTEND VALIDATION (basic)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/;
  
    if (emailRegex.test(message) || phoneRegex.test(message)) {
      alert("❌ Sharing email addresses or phone numbers is not allowed.");
      return;
    }
  
    setLoading(true);
  
    const senderRole = localStorage.getItem("role");
    const recipient = chatUsers.find((user) => user._id === recipientId);
  
    if (!recipient) {
      alert("⚠️ Recipient not found in chat users.");
      setLoading(false);
      return;
    }
  
    const recipientRole = recipient?.role || "student";
  
    const messageData = {
      senderId: userId,
      senderRole,
      recipientId,
      recipientRole,
      messageContent: message.trim() || null,
      fileUrl: file ? URL.createObjectURL(file) : null,
    };
  
    try {
      const response = await fetch(`http://localhost:4000/api/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        const errorMsg =
          responseData?.error || "❌ Message sending failed due to a server error.";
        alert(errorMsg);
        throw new Error(errorMsg);
      }
  
      // Message sent successfully
      setMessages((prevMessages) => [...prevMessages, responseData.data]);
      socket.emit("sendMessage", responseData.data);
    } catch (error) {
      console.error("❌ Failed to send message:", error.message);
    }
  
    setMessage("");
    setFile(null);
    setLoading(false);
  };
  
  // ✅ Scroll to Bottom Function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Back to Dashboard Button (Now Uses Role)
  const handleBackToDashboard = () => {
    if (role === "teacher") {
      navigate("/dashboard/teacher"); // ✅ If teacher, go to teacher dashboard
    } else {
      navigate("/dashboard/student"); // ✅ If student, go to student dashboard
    }
  };

  return (
    <div className="chat-layout">
      <div className="sidebar chat-users-sidebar">
        <h3>Chats</h3>
        {chatUsers.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          <ul>
            {chatUsers.map((user) => (
              <li
                key={user._id}
                className={user._id === recipientId ? "active" : ""}
                onClick={() => navigate(`/chat/${userId}/${user._id}`)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
        {/* ✅ Updated to use handleBackToDashboard */}
        <div className="back-to-dashboard" onClick={handleBackToDashboard}>
          🔙 Back to Dashboard
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2>{recipientId === "default" ? "Select a User to Chat" : `Chat with ${recipientName}`}</h2>
        </div>
        <div className="messages">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div key={msg._id || index} className={`message ${msg.sender === userId ? "sent" : "received"}`}>
                <p>{msg.message || "📄 Attachment"}</p>
                {msg.fileUrl && <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">📎 View File</a>}
                <span className="timestamp">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "Sending..."}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Fields for Message and File */}
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;