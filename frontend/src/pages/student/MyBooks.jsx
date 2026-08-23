import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { AxiosInstance } from '../../utils/axiosInstance';

const MyBooks = () => {
  const { myBooks, fetchMyBooks, loading } = useContext(AppContext);
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    // Fetch books when component loads
    fetchMyBooks();
  }, []);

  const handleReturnBook = async (borrowId) => {
    try {
      setReturning(borrowId);
      const { data } = await AxiosInstance.post("/borrow/return", { borrowId });
      
      if (data.success) {
        toast.success("Book returned successfully!");
        // Refresh the books list
        fetchMyBooks();
      } else {
        toast.error(data.message || "Failed to return book");
      }
    } catch (error) {
      console.log("Error returning book:", error);
      toast.error(error.response?.data?.message || "Failed to return book");
    } finally {
      setReturning(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        Loading your books...
      </div>
    );
  }

  // Filter books by status
  const activeBooks = myBooks.filter(book => book.status === 'borrowed');
  const returnedBooks = myBooks.filter(book => book.status === 'returned');
  const overdueBooks = myBooks.filter(book => 
    book.status === 'borrowed' && new Date(book.dueDate) < new Date()
  );

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          My Books
        </h1>
        <p className="text-gray-600">
          📖 Your personal library collection and reading history
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{myBooks.length}</div>
          <div className="text-sm">Total Books</div>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{activeBooks.length}</div>
          <div className="text-sm">Currently Reading</div>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{returnedBooks.length}</div>
          <div className="text-sm">Completed</div>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{overdueBooks.length}</div>
          <div className="text-sm">Overdue</div>
        </div>
      </div>

      {/* Books Display */}
      {myBooks && myBooks.length > 0 ? (
        <div className="space-y-6">
          {/* Currently Reading Books */}
          {activeBooks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                📚 Currently Reading ({activeBooks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBooks.map((borrow) => (
                  <div key={borrow._id} className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {borrow.book?.coverImage?.url ? (
                          <img
                            src={borrow.book.coverImage.url}
                            alt={borrow.book.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-2xl">📖</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 truncate">
                          {borrow.book?.title || 'N/A'}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {borrow.book?.category || 'N/A'}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {borrow.book?.language || 'English'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📅 Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</div>
                          <div className={new Date(borrow.dueDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                            ⏰ Due: {new Date(borrow.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="mt-3">
                          {new Date(borrow.dueDate) < new Date() ? (
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
                              🚨 Overdue
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                              ✅ Active
                            </span>
                          )}
                        </div>

                        {/* Return Button */}
                        <button
                          onClick={() => handleReturnBook(borrow._id)}
                          disabled={returning === borrow._id}
                          className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                            returning === borrow._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : new Date(borrow.dueDate) < new Date()
                              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                          }`}
                        >
                          {returning === borrow._id ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              <span>Returning...</span>
                            </>
                          ) : (
                            <>
                              <span>📤</span>
                              <span>Return Book</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Returned Books History */}
          {returnedBooks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                📋 Reading History ({returnedBooks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {returnedBooks.map((borrow) => (
                  <div key={borrow._id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                    <div className="text-center">
                      <div className="w-12 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        {borrow.book?.coverImage?.url ? (
                          <img
                            src={borrow.book.coverImage.url}
                            alt={borrow.book.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-lg">📚</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 truncate">
                        {borrow.book?.title || 'N/A'}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {borrow.book?.category || 'N/A'}
                      </p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        ✅ Completed
                      </span>
                      {borrow.returnDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Returned: {new Date(borrow.returnDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Library Journey Starts Here!</h3>
          <p className="text-gray-500 mb-6">No books borrowed yet. Discover amazing books waiting for you!</p>
          <a 
            href="/student/books"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            🔍 Explore Books
          </a>
        </div>
      )}
    </div>
  );
};

export default MyBooks;