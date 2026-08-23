import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { AxiosInstance } from "../../utils/AxiosInstance";

const AdminDashboard = () => {
  const { adminStats, loading } = useContext(AppContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowLoading, setBorrowLoading] = useState(false);

  const stats = adminStats?.stats || {};

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks || 0,
      icon: "📚"
    },
    {
      title: "Available Books", 
      value: stats.availableBooks || 0,
      icon: "✅"
    },
    {
      title: "Currently Borrowed",
      value: stats.currentlyBorrowed || 0,
      icon: "📤"
    },
    {
      title: "Total Students",
      value: stats.totalStudents || 0,
      icon: "👥"
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks || 0,
      icon: "🚨"
    },
    {
      title: "Recent Borrows (7 days)",
      value: stats.recentBorrows || 0,
      icon: "📈"
    }
  ];

  const booksByCategory = stats.booksByCategory || [];

  const fetchBorrowedBooks = async () => {
    try {
      setBorrowLoading(true);
      const { data } = await AxiosInstance.get("/borrow/admin/all");
      if (data.success) {
        setBorrowedBooks(data.borrowedBooks || []);
      }
    } catch (error) {
      console.log("Error fetching borrowed books:", error);
    } finally {
      setBorrowLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to Library Management System Admin Panel
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg border-3 border-blue-500 hover:transform hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl bg-blue-500 text-white w-15 h-15 rounded-full flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-2">
                {card.value}
              </h3>
              <p className="text-base font-medium text-gray-600">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Borrow Activity Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-5 border-b-2 border-gray-200 pb-2">
          📈 Recent Borrow Activity
        </h2>
        
        {borrowLoading ? (
          <div className="text-center py-4">Loading borrowed books...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Book Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Borrow Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.slice(0, 10).map((borrow, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{borrow.student?.name || 'N/A'}</td>
                    <td className="px-4 py-3">{borrow.student?.email || 'N/A'}</td>
                    <td className="px-4 py-3">{borrow.book?.title || 'N/A'}</td>
                    <td className="px-4 py-3">{borrow.book?.category || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(borrow.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        borrow.status === 'returned' 
                          ? 'bg-green-100 text-green-800' 
                          : new Date(borrow.dueDate) < new Date()
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {borrow.status === 'returned' 
                          ? 'Returned' 
                          : new Date(borrow.dueDate) < new Date()
                          ? 'Overdue'
                          : 'Borrowed'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {borrowedBooks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No borrow records found
              </div>
            )}
            
            {borrowedBooks.length > 10 && (
              <div className="text-center mt-4">
                <span className="text-gray-600">
                  Showing 10 of {borrowedBooks.length} records
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;