// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/messages';
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Get messages for a user
export const getMessages = async (userId, role) => {
  try {
    const response = await axios.get(`${API_URL}/get/${userId}/${role}`);
    console.log("📩 API Response:", response.data);  // ✅ Debug here
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error.response?.data || error.message);
    return { messages: [] };
  }
};


// Send a message via API
export const sendMessage = async (senderId, recipientId, messageContent, file) => {
  const formData = new FormData();
  formData.append('senderId', senderId);
  formData.append('recipientId', recipientId);
  formData.append('messageContent', messageContent);
  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await axios.post(`${API_URL}/send`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message', error);
  }
};

export const getChatUsers = async (userId, role) => {
  const apiUrl = `${API_BASE_URL}/api/messages/users/${userId}/${role}`; // ✅ Fixed Route
  console.log("📡 Fetching Chat Users from:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("✅ Chat Users Fetched:", data);
    return data.users || [];
  } catch (error) {
    console.error("❌ Error fetching chat users:", error);
    return [];
  }
};

