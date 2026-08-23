import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Admin Components
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddBook from "./pages/admin/AddBook";
import AddStudent from "./pages/admin/AddStudent";
import BookList from "./pages/admin/BookList";
import BookBorrowed from "./pages/admin/BookBorrowed";
import BookReturned from "./pages/admin/BookReturned";
import OverdueBooks from "./pages/admin/OverdueBooks";
import StudentLists from "./pages/admin/StudentLists";
import UpdateBook from "./pages/admin/UpdateBook";
import UpdateStudent from "./pages/admin/UpdateStudent";

// Student Components
import Layout from "./pages/student/Layout";
import StudentDashboard from "./pages/student/StudentDashboard";
import Books from "./pages/student/Books";
import MyBooks from "./pages/student/MyBooks";


const App = () => {
const location = useLocation();
const adminPath = location.pathname.includes("/admin")

  return (
    <>
      <Toaster />
      {/* Auth Routes */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="book-list" element={<BookList />} />
          <Route path="book-borrowed" element={<BookBorrowed />} />
          <Route path="book-returned" element={<BookReturned />} />
          <Route path="overdue-books" element={<OverdueBooks />} />
          <Route path="student-lists" element={<StudentLists />} />
          <Route path="update-book/:id" element={<UpdateBook />} />
          <Route path="update-student/:id" element={<UpdateStudent />} />
        </Route>
        
        {/* Student Routes */}
        <Route path="/student" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="my-books" element={<MyBooks />} />
        </Route>
        
        {/* Default route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;