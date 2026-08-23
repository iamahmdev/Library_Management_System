import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const StudentDashboard = () => {
  const { studentStats, fetchStudentDashboardStats, loading, myBooks, fetchMyBooks } = useContext(AppContext);

  useEffect(() => {
    // Always fetch fresh stats and books when component loads
    const loadData = async () => {
      await fetchStudentDashboardStats();
      await fetchMyBooks();
    };
    loadData();
  }, []);

  const stats = studentStats || {};

  const statCards = [
    {
      title: "Total Borrowed",
      value: stats.totalBorrowHistory || 0,
      icon: "📚"
    },
    {
      title: "Currently Reading", 
      value: stats.currentlyBorrowed || 0,
      icon: "📖"
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks || 0,
      icon: "🚨"
    }
  ];

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
          Student Dashboard
        </h1>
        <p className="text-gray-600">
          🌟 Track Your Books, Manage Your Learning Experience
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

      {/* Recent Activity Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-5 border-b-2 border-gray-200 pb-2">
          📈 Recent Activity
        </h2>
        
        {loading ? (
          <div className="text-center py-4">Loading your books...</div>
        ) : (
          <div className="overflow-x-auto">
            {myBooks && myBooks.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Book Title</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Language</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Borrow Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myBooks.slice(0, 5).map((borrow, index) => (
                    <tr key={borrow._id || index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{borrow.book?.title || 'N/A'}</td>
                      <td className="px-4 py-3">{borrow.book?.category || 'N/A'}</td>
                      <td className="px-4 py-3">{borrow.book?.language || 'English'}</td>
                      <td className="px-4 py-3">
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(borrow.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          borrow.status === 'returned' 
                            ? 'bg-blue-100 text-blue-800' 
                            : new Date(borrow.dueDate) < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {borrow.status === 'returned' 
                            ? 'Returned' 
                            : new Date(borrow.dueDate) < new Date()
                            ? 'Overdue'
                            : 'Active'
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-lg">No borrowed books yet</p>
                <p className="text-sm">Start exploring the library to see your activity here!</p>
              </div>
            )}
            
            {myBooks && myBooks.length > 5 && (
              <div className="text-center mt-4">
                <span className="text-gray-600">
                  Showing 5 of {myBooks.length} borrowed books
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* No Stats Message */}
      {!studentStats && !loading && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Statistics Available</h3>
          <p className="text-gray-500">Start borrowing books to see your statistics!</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;