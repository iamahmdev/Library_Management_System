import React, { useState, useEffect, useContext } from 'react';
import { AxiosInstance } from '../../utils/AxiosInstance';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';

const Books = () => {
  const { fetchStudentDashboardStats, fetchMyBooks } = useContext(AppContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(null);
  const [selectedDueDates, setSelectedDueDates] = useState({});

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get("/api/books");
      if (data.success) {
        console.log("Books data:", data.books); // Debug log
        console.log("First book:", data.books[0]); // Check first book structure
        setBooks(data.books || []);
      }
    } catch (error) {
      console.log("Error fetching books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    const dueDate = selectedDueDates[bookId];
    
    if (!dueDate) {
      toast.error("Please select a due date first!");
      return;
    }

    try {
      setBorrowing(bookId);
      const { data } = await AxiosInstance.post("/api/borrow/borrow", { 
        bookId, 
        dueDate 
      });
      
      if (data.success) {
        toast.success("Book borrowed successfully!");
        // Clear the due date for this book
        setSelectedDueDates(prev => ({
          ...prev,
          [bookId]: ''
        }));
        
        // Refresh all relevant data in sequence
        await fetchAllBooks(); // Update books list
        await fetchStudentDashboardStats(); // Update stats
        await fetchMyBooks(); // Update borrowed books list
        
        console.log("All data refreshed after borrowing"); // Debug log
      } else {
        toast.error(data.message || "Failed to borrow book");
      }
    } catch (error) {
      console.log("Error borrowing book:", error);
      toast.error(error.response?.data?.message || "Failed to borrow book");
    } finally {
      setBorrowing(null);
    }
  };

  const handleDueDateChange = (bookId, date) => {
    setSelectedDueDates(prev => ({
      ...prev,
      [bookId]: date
    }));
  };

  // Generate minimum date (tomorrow) and maximum date (30 days from today)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        Loading books...
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          All Books
        </h1>
        <p className="text-gray-600">
          📚 Browse and borrow books from our library collection
        </p>
      </div>

      {/* Books Grid - Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow p-4">
            
            {/* Book Image & Title */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-20 bg-blue-50 rounded flex-shrink-0 flex items-center justify-center">
                {book.coverImage && book.coverImage.url ? (
                  <img
                    src={book.coverImage.url}
                    alt={book.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-2xl">📚</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 leading-tight">
                  {book.title || 'No Title'}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {book.category || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {book.language || 'English'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simple Stats & Due Date Selector */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              {/* Book Summary - Single Line */}
              <div className="text-sm text-center mb-3 py-2 bg-white rounded border">
                <span className="text-gray-600">📊 </span>
                <span className="font-medium text-blue-600">{book.totalCopies || 0}</span>
                <span className="text-gray-500 mx-1">total</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium text-green-600 ml-1">{book.availableCopies || 0}</span>
                <span className="text-gray-500 ml-1">available</span>
              </div>
              
              {/* Due Date Selector */}
              {book.availableCopies > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Due Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDueDates[book._id] || ''}
                    onChange={(e) => handleDueDateChange(book._id, e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum 30 days from today
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleBorrowBook(book._id)}
              disabled={book.availableCopies === 0 || borrowing === book._id || !selectedDueDates[book._id]}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                book.availableCopies > 0 && borrowing !== book._id && selectedDueDates[book._id]
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {borrowing === book._id 
                ? 'Borrowing...' 
                : book.availableCopies === 0
                ? 'Not Available'
                : !selectedDueDates[book._id]
                ? 'Select Due Date First'
                : '📚 Borrow Book'
              }
            </button>
          </div>
        ))}
      </div>

      {/* No Books Message */}
      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Available</h3>
          <p className="text-gray-500">Check back later for new books!</p>
        </div>
      )}
    </div>
  );
};

export default Books;