import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminMessageUser.css";
import { useNavigate } from "react-router-dom";

const SendMessageForm = () => {

    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]); 
    const [students, setStudents] = useState([]); 
    const [formData, setFormData] = useState({
        senderId: "",
        senderRole: "teacher",
        recipientId: "",
        recipientRole: "student",
        messageContent: "",
        file: null
    });

    // Fetch teachers & students
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const teachersRes = await axios.get("https://mtn1-backend-production.up.railway.app/api/admin/teachers");
                setTeachers(teachersRes.data);

                const studentsRes = await axios.get("https://mtn1-backend-production.up.railway.app/api/admin/students");
                setStudents(studentsRes.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const phoneRegex = /(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/;
      
        if (!formData.messageContent.trim() && !formData.file) {
          alert("⚠️ Message cannot be empty and no file attached.");
          return;
        }
      
        if (emailRegex.test(formData.messageContent) || phoneRegex.test(formData.messageContent)) {
          alert("❌ Sharing email addresses or phone numbers is not allowed.");
          return;
        }
      
        const formDataObj = new FormData();
        formDataObj.append("senderId", formData.senderId);
        formDataObj.append("senderRole", formData.senderRole);
        formDataObj.append("recipientId", formData.recipientId);
        formDataObj.append("recipientRole", formData.recipientRole);
        formDataObj.append("messageContent", formData.messageContent);
      
        if (formData.file) {
          formDataObj.append("file", formData.file);
        }
      
        try {
          const response = await axios.post("https://mtn1-backend-production.up.railway.app/api/messages/send", formDataObj, {
            headers: { "Content-Type": "multipart/form-data" }
          });
      
          if (response.data?.error) {
            alert(`❌ ${response.data.error}`);
            return;
          }
      
          alert("✅ Message sent successfully!");
          setFormData({
            senderId: "",
            senderRole: "teacher",
            recipientId: "",
            recipientRole: "",
            messageContent: "",
            file: null,
          });
        } catch (error) {
          console.error(error);
          const errorMessage =
            error.response?.data?.error || "❌ Error sending message!";
          alert(errorMessage);
        }
      };
      

    return (
        <div className="send-message-form">
          
            <div className="send-message-input">
            <form onSubmit={handleSubmit}>
                {/* Select Sender (Teacher) */}
                <label>Sender (Teacher)</label>
                <select name="senderId" value={formData.senderId} onChange={handleChange} required>
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.name} ({teacher._id})
                        </option>
                    ))}
                </select>

                {/* Select Recipient Role */}
                <label>Recipient Role</label>
                <select name="recipientRole" value={formData.recipientRole} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                {/* Select Recipient (Dynamic) */}
                <label>Recipient</label>
                <select name="recipientId" value={formData.recipientId} onChange={handleChange} required>
                    <option value="">Select Recipient</option>
                    {formData.recipientRole === "student" &&
                        students.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name} ({student._id})
                            </option>
                        ))}
                    {formData.recipientRole === "teacher" &&
                        teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                                {teacher.name} ({teacher._id})
                            </option>
                        ))}
                </select>

                {/* Message */}
                <label>Message</label>
                <textarea
                    name="messageContent"
                    placeholder="Type your message"
                    value={formData.messageContent}
                    onChange={handleChange}
                    required
                ></textarea>

                {/* File Upload */}
                <label>Attach File (Optional)</label>
                <input type="file" name="file" onChange={handleFileChange} />

                <button type="submit">Send Message</button>
                {/* Back to Dashboard Button */}
         <div className="back-to-dashboard-container">
         <button className="back-to-dashboard-btn" onClick={() => navigate("/dashboard/admin")}>
             ⬅ Back to Dashboard
         </button>
     </div>
            </form>
            </div>
                  
        </div>
         
    );
};

export default SendMessageForm;
