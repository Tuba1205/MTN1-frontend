import { useEffect, useState } from 'react';
import axios from 'axios';
import { isTokenExpired } from '../utilis/token'; // Token expiry check
import "../styles/Profile.css";
import Sidebar from "../components/Sidebar"; // Sidebar component

const Profile = () => {
    const [student, setStudent] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token || isTokenExpired(token)) {
                    setError("Session expired. Please log in again.");
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get("https://mtn1-backend-production.up.railway.app/api/students/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ Profile Data Received:", response.data);
                setStudent(response.data); // ✅ Correctly setting student data
            } catch (error) {
                console.error("❌ Error fetching profile:", error.response?.data || error.message);
                setError("Failed to load profile. Please try again.");
            } finally {
                setLoading(false); // ✅ Ensure loading state is updated
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await axios.put(
                'https://mtn1-backend-production.up.railway.app/api/students/profile',
                { name: student.name, email: student.email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setStudent(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Error updating profile');
            console.error('Update Error:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard-container">
            <Sidebar /> {/* Sidebar Component */}

            <div className="profile-container">
                <h2>Student Profile</h2>
                {success && <p className="success">Profile updated successfully!</p>}

                {/* Displaying User Information */}
                <div className="profile-info">
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Password:</strong> ********** (Cannot be edited)</p>
                </div>

                {/* Profile Update Form */}
                <form onSubmit={handleSubmit} className="update-form">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={student.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={student.email}
                        onChange={handleChange}
                        readOnly
                    />

                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
