import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "../utils/AxiosInstance";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [adminStats, setAdminStats] = useState();
  const [studentStats, setStudentStats] = useState();
  const [students, setStudents] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  const isAdmin = user && user.role === "admin";
  const isStudent = user && user.role === "student";


  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const { data } = await AxiosInstance.get("/auth/me");

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      }
    }
  }; 


  // Fetch admin dashboard stats
  const fetchAdminDashboardStats= async () => {
     try {
       const {data} = await AxiosInstance.get("/books/stats")
        if(data.success){
          setAdminStats(data)
        }
  
      
     } catch (error) {
      console.log("error to fetch admin stats",error)
      
     }
  }

  // Fetch student dashboard stats
  const fetchStudentDashboardStats = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get("/borrow/dashboard");
      if (data.success) {
        // Backend sends stats in data.dashboard object
        setStudentStats(data.dashboard);
        console.log("Student stats updated:", data.dashboard); // Debug log
      }
    } catch (error) {
      console.log("error to fetch student stats", error);
      // Set empty stats if error
      setStudentStats({});
    } finally {
      setLoading(false);
    }
  };

  // fetch all students
  const fetchStudents = async () => {
    try {
      const { data } = await AxiosInstance.get("/admin/students");
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.log("error to fetch students", error);
    }
  };

  // Fetch student's own borrowed books
  const fetchMyBooks = async () => {
    try {
      const { data } = await AxiosInstance.get("/borrow/my");
      if (data.success) {
        setMyBooks(data.borrowedBooks || []);
        console.log("My books updated:", data.borrowedBooks); // Debug log
      } else {
        setMyBooks([]);
      }
    } catch (error) {
      console.log("error to fetch my books", error);
      setMyBooks([]);
    }
  };

  // fetch all borrowed books
  const fetchBorrowedBooks = async () => {
    try {
      const { data } = await AxiosInstance.get("/borrow/all");
      if (data.success) {
        setBorrowedBooks(data.borrowedBooks || []);
      }
    } catch (error) {
      console.log("error to fetch borrowed books", error);
    }
  };

  // fetch overdue books
  const fetchOverdueBooks = async () => {
    try {
      const { data } = await AxiosInstance.get("/borrow/overdue");
      if (data.success) {
        setOverdueBooks(data.overdueBooks || []);
      }
    } catch (error) {
      console.log("error to fetch overdue books", error);
    }
  };

  useEffect(() => {
    fetchUser(); 
  }, []);

  // Authentication check - redirect to login if user not authenticated
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/login' || currentPath === '/register' || 
                      currentPath === '/forgot-password' || currentPath.startsWith('/reset-password');
    
    // If user is not logged in and not on auth pages, redirect to login
    if (user === null && !isAuthPage) {
      navigate('/login');
    }
  }, [user, navigate]);


  useEffect(() => {
     if(isAdmin){
       fetchAdminDashboardStats();
       fetchStudents();
       fetchBorrowedBooks();
       fetchOverdueBooks();
     }
     if(isStudent){
       fetchStudentDashboardStats();
       fetchMyBooks();
     }
  }, [isAdmin, isStudent])
  const value = {
    loading,
    setLoading,
    user,
    setUser,
    navigate,
    adminStats,
    fetchAdminDashboardStats,
    studentStats,
    fetchStudentDashboardStats,
    students,
    fetchStudents,
    borrowedBooks,
    fetchBorrowedBooks,
    myBooks,
    fetchMyBooks,
    overdueBooks,
    fetchOverdueBooks
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;