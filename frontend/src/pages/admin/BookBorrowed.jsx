import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

const BookBorrowed = () => {
  const { borrowedBooks, loading, fetchBorrowedBooks } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter only borrowed (not returned) books
  const currentlyBorrowed = borrowedBooks.filter(borrow => borrow.status === 'borrowed');
  
  // Filter based on search
  const filteredBorrows = currentlyBorrowed.filter(borrow =>
    borrow.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.book?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-600">Loading borrowed books...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <span className="text-2xl">📤</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books Currently Borrowed</h1>
            <p className="text-gray-600">Track all books currently borrowed by students</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Borrowed</p>
              <h3 className="text-3xl font-bold">{currentlyBorrowed.length}</h3>
            </div>
            <div className="text-4xl opacity-80">📤</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Overdue</p>
              <h3 className="text-3xl font-bold">
                {currentlyBorrowed.filter(b => isOverdue(b.dueDate)).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Search Results</p>
              <h3 className="text-3xl font-bold">{filteredBorrows.length}</h3>
            </div>
            <div className="text-4xl opacity-80">🔍</div>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            onClick={fetchBorrowedBooks}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Borrowed Books Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Currently Borrowed Books</h2>
        </div>

        {filteredBorrows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Borrowed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBorrows.map((borrow) => (
                  <tr key={borrow._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-16 bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden flex-shrink-0">
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
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
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
                      <div className={`text-gray-900 ${isOverdue(borrow.dueDate) ? 'text-red-600 font-semibold' : ''}`}>
                        {new Date(borrow.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isOverdue(borrow.dueDate) ? (
                          <span className="text-red-500 font-medium">
                            {Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                          </span>
                        ) : (
                          <span className="text-green-500">
                            {Math.ceil((new Date(borrow.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        isOverdue(borrow.dueDate)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isOverdue(borrow.dueDate) ? '⚠️ Overdue' : '📤 Borrowed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {currentlyBorrowed.length === 0 ? 'No books currently borrowed' : 'No books found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {currentlyBorrowed.length === 0
                ? 'All books are available in the library right now.'
                : 'Try adjusting your search terms to find specific borrowed books.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookBorrowed;