import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const App = () => {
  return (
    <>
      <Toaster />
      {/* Auth Routes */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Dashboard Routes */}
        <Route path="/admin/dashboard" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to Admin Panel!</p>
          </div>
        } />
        <Route path="/student" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Student Dashboard</h1>
            <p>Welcome Student!</p>
          </div>
        } />
        
        {/* Default route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;