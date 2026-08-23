import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

const BookReturned = () => {
  // const { borrowedBooks, loading, fetchBorrowedBooks } = useContext(AppContext);
  // const [searchTerm, setSearchTerm] = useState('');

  // // Filter only returned books
  // const returnedBooks = borrowedBooks.filter(borrow => borrow.status === 'returned');
  
  // // Filter based on search
  // const filteredReturns = returnedBooks.filter(borrow =>
  //   borrow.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   borrow.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   borrow.book?.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // // Check if book was returned late
  // const wasReturnedLate = (dueDate, returnDate) => {
  //   return new Date(returnDate) > new Date(dueDate);
  // };

  // // Calculate days late or early
  // const getDaysLateOrEarly = (dueDate, returnDate) => {
  //   const diffTime = new Date(returnDate) - new Date(dueDate);
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-96">
  //       <div className="text-lg text-gray-600">Loading returned books...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-center items-center h-96">
        <div className="text-2xl text-gray-600">BookReturned Component - Coming Soon</div>
      </div>
    </div>
  );

  {/* Original Component Code - Commented Out */}
  {/*
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="text-2xl">📥</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books Returned</h1>
            <p className="text-gray-600">Track all books that have been returned by students</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Returned</p>
              <h3 className="text-3xl font-bold">{returnedBooks.length}</h3>
            </div>
            <div className="text-4xl opacity-80">📥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">On Time</p>
              <h3 className="text-3xl font-bold">
                {returnedBooks.filter(b => !wasReturnedLate(b.dueDate, b.returnDate)).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Returned Late</p>
              <h3 className="text-3xl font-bold">
                {returnedBooks.filter(b => wasReturnedLate(b.dueDate, b.returnDate)).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">⏰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Search Results</p>
              <h3 className="text-3xl font-bold">{filteredReturns.length}</h3>
            </div>
            <div className="text-4xl opacity-80">🔍</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search by student name, email, or book title..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Returned Books History</h2>
        </div>

        {filteredReturns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Borrowed Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Returned Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReturns.map((borrow) => (
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
                      <div className="text-gray-900">
                        {new Date(borrow.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(borrow.dueDate).toLocaleDateString('en-US', {
                          weekday: 'long'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {new Date(borrow.returnDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(borrow.returnDate).toLocaleDateString('en-US', {
                          weekday: 'long'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {wasReturnedLate(borrow.dueDate, borrow.returnDate) ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          ⏰ {getDaysLateOrEarly(borrow.dueDate, borrow.returnDate)} days late
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✅ On time
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {returnedBooks.length === 0 ? 'No books returned yet' : 'No books found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {returnedBooks.length === 0
                ? 'When students return books, they will appear here.'
                : 'Try adjusting your search terms to find specific returned books.'
              }
            </p>
          </div>
        )}
      </div>
  */}
};

export default BookReturned;