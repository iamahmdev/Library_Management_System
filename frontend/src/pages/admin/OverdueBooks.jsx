import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { AxiosInstance } from '../../utils/axiosInstance';

const OverdueBooks = () => {
  const { loading } = useContext(AppContext);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingOverdue, setLoadingOverdue] = useState(false);

  // Fetch overdue books
  const fetchOverdueBooks = async () => {
    try {
      setLoadingOverdue(true);
      const { data } = await AxiosInstance.get("/borrow/overdue");
      if (data.success) {
        setOverdueBooks(data.overdueBooks || []);
      }
    } catch (error) {
      console.log("error to fetch overdue books", error);
    } finally {
      setLoadingOverdue(false);
    }
  };

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  // Filter based on search
  const filteredOverdue = overdueBooks.filter(borrow =>
    borrow.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.book?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate days overdue
  const getDaysOverdue = (dueDate) => {
    const diffTime = new Date() - new Date(dueDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get severity level based on days overdue
  const getSeverityLevel = (daysOverdue) => {
    if (daysOverdue <= 7) return 'warning'; // 1-7 days
    if (daysOverdue <= 14) return 'danger'; // 8-14 days
    return 'critical'; // 15+ days
  };

  if (loading || loadingOverdue) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-600">Loading overdue books...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Overdue Books</h1>
            <p className="text-gray-600">Track all books that are past their due date</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Total Overdue</p>
              <h3 className="text-3xl font-bold">{overdueBooks.length}</h3>
            </div>
            <div className="text-4xl opacity-80">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">1-7 Days Late</p>
              <h3 className="text-3xl font-bold">
                {overdueBooks.filter(b => {
                  const days = getDaysOverdue(b.dueDate);
                  return days >= 1 && days <= 7;
                }).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">⏰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">8-14 Days Late</p>
              <h3 className="text-3xl font-bold">
                {overdueBooks.filter(b => {
                  const days = getDaysOverdue(b.dueDate);
                  return days >= 8 && days <= 14;
                }).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">🔥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">15+ Days Late</p>
              <h3 className="text-3xl font-bold">
                {overdueBooks.filter(b => getDaysOverdue(b.dueDate) >= 15).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">🚨</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search by student name, email, or book title..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Clear
          </button>
          <button
            onClick={fetchOverdueBooks}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overdue Books Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Overdue Books - Immediate Action Required</h2>
        </div>

        {filteredOverdue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Borrowed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Days Overdue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOverdue
                  .sort((a, b) => getDaysOverdue(b.dueDate) - getDaysOverdue(a.dueDate)) // Most overdue first
                  .map((borrow) => {
                    const daysOverdue = getDaysOverdue(borrow.dueDate);
                    const severity = getSeverityLevel(daysOverdue);
                    
                    return (
                      <tr key={borrow._id} className={`hover:bg-gray-50 transition-colors ${
                        severity === 'critical' ? 'bg-red-50' : 
                        severity === 'danger' ? 'bg-orange-50' : 'bg-yellow-50'
                      }`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-16 bg-gradient-to-b from-red-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden flex-shrink-0">
                              {borrow.book?.coverImage?.url ? (
                                <img
                                  src={borrow.book.coverImage.url}
                                  alt={borrow.book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl">📖</span>
                              )}
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {borrow.book?.title || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {borrow.book?.category || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {borrow.student?.name?.charAt(0).toUpperCase() || 'N'}
                            </div>
                            <div className="ml-4">
                              <div className="font-semibold text-gray-900">{borrow.student?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{borrow.student?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">
                            {new Date(borrow.borrowDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(borrow.borrowDate).toLocaleDateString('en-US', {
                              weekday: 'long'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-red-600 font-semibold">
                            {new Date(borrow.dueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-red-500">
                            {new Date(borrow.dueDate).toLocaleDateString('en-US', {
                              weekday: 'long'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-red-600 font-bold text-lg">
                            {daysOverdue}
                          </div>
                          <div className="text-sm text-red-500">
                            {daysOverdue === 1 ? 'day overdue' : 'days overdue'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {severity === 'critical' ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              🚨 Critical
                            </span>
                          ) : severity === 'danger' ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                              🔥 High
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              ⏰ Medium
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {overdueBooks.length === 0 ? 'No overdue books!' : 'No books found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {overdueBooks.length === 0
                ? 'Great job! All borrowed books are within their due dates.'
                : 'Try adjusting your search terms to find specific overdue books.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueBooks;