import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "../utils/AxiosInstance";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [adminStats, setAdminStats] = useState();
  const [students, setStudents] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  const isAdmin = user && user.role === "admin"


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


  // fetch admin dashboard stats
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


  useEffect(() => {
     if(isAdmin){
       fetchAdminDashboardStats();
       fetchStudents();
       fetchBorrowedBooks();
       fetchOverdueBooks();
     }
  }, [isAdmin])
  const value = {
    loading,
    setLoading,
    user,
    setUser,
    navigate,
    adminStats,
    fetchAdminDashboardStats,
    students,
    fetchStudents,
    borrowedBooks,
    fetchBorrowedBooks,
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