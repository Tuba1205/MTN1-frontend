import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import EmailAuth from "./pages/EmailAuth";
import OtpVerification from "./pages/OtpVerification";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardHome from "./pages/DashboardHome";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatPage from "./components/ChatPage";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherList from "./components/TeacherList";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeLogin from "./pages/EmployeeLogin";
import AdminStudents from "./components/AdminStudent";
import AdminTeachers from "./components/AdminTeacher";
import AdminMessages from "./components/AdminMessage";
import AdminBookings from "./components/AdminBookings";
import AdminTimeSlotManagement from "./components/AdminTimeSlotManagement";
import CreateUser from "./pages/CreateUser";
import CreateStudent from "./components/CreateStudent";
import CreateTeacher from "./components/CreateTeacher";
import TeacherBookings from "./components/TeacherBookings";
import TeacherProfile from "./components/TeacherProfile";
import AdminMessageUser from "./components/AdminMessageUser";

const App = () => {
  return (
    <Routes>
      {/* Landing & Authentication Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/email-auth" element={<EmailAuth />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/teachers" element={<TeacherList />} />
      <Route path="/employeelogin" element={<EmployeeLogin />} />
      <Route path="/dashboard/teacher" element={<TeacherDashboard/>} />

      /* Admin Dashboard Routes */
      <Route path="/admin/students" element={<AdminStudents/>} />
      <Route path="/admin/teachers" element={<AdminTeachers/>} />
      <Route path="/admin/messages" element={<AdminMessages/>} />
      <Route path="/admin/bookings" element={<AdminBookings/>} />
      <Route path="/admin/createuser" element={<CreateUser/>} />
      <Route path="/admin/create-student" element={<CreateStudent/>} />
      <Route path="/admin/create-teacher" element={<CreateTeacher/>} />
      <Route path="/admin/timeslots" element={<AdminTimeSlotManagement/>} />
      <Route path="/admin/sendmessage" element={<AdminMessageUser/>} />

      /*Student Dashboard Routes */
      <Route path="bookings" element={<Bookings />} />
      <Route path="/chat/:userId/:recipientId" element={<ChatPage />} />
      <Route path="profile" element={<Profile />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="/dashboard/*" element={<DashboardHome />} />

      /* Teacher Dashboard Routes */
      <Route path="bookings/teacher" element={<TeacherBookings />} />
      <Route path="profile/teacher" element={<TeacherProfile />} />

      {/* Protected Dashboard Route with Nested Routes  */}
      {/* <Route element={<ProtectedRoute />}> */}
         <Route path="/dashboard/student" element={<StudentDashboard />} />
         <Route path="/dashboard/admin" element={<AdminDashboard/>} />
         <Route path="/dashboard/teacher" element={<TeacherDashboard/>} />
      {/* </Route> */}
    </Routes>
  );
};

export default App;
