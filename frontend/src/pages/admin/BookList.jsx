import React, { useState, useEffect, useContext } from 'react';
import { AxiosInstance } from '../../utils/AxiosInstance';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BookList = () => {
  const { loading, setLoading, navigate } = useContext(AppContext);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  
  // Get unique categories and languages for filters
  const categories = [...new Set(books.map(book => book.category).filter(Boolean))];
  const languages = [...new Set(books.map(book => book.language).filter(Boolean))];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get('/books');
      if (data.success) {
        setBooks(data.books || []);
        setFilteredBooks(data.books || []);
      }
    } catch (error) {
      console.log('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const { data } = await AxiosInstance.delete(`/books/${bookId}`);
      if (data.success) {
        toast.success(data.message);
        fetchBooks(); // Refresh the list
      }
    } catch (error) {
      console.log('Error deleting book:', error);
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  // Filter books based on search and filters
  useEffect(() => {
    let filtered = books;

    // Search by title
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter(book => book.language === selectedLanguage);
    }

    // Filter by availability
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(book => book.availableCopies > 0);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(book => book.availableCopies === 0);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory, selectedLanguage, availabilityFilter]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLanguage('');
    setAvailabilityFilter('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
            <p className="text-gray-600">Manage your complete book collection</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Books</p>
              <h3 className="text-3xl font-bold">{books.length}</h3>
            </div>
            <div className="text-4xl opacity-80">📖</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Available</p>
              <h3 className="text-3xl font-bold">
                {books.filter(b => b.availableCopies > 0).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Out of Stock</p>
              <h3 className="text-3xl font-bold">
                {books.filter(b => b.availableCopies === 0).length}
              </h3>
            </div>
            <div className="text-4xl opacity-80">❌</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Categories</p>
              <h3 className="text-3xl font-bold">{categories.length}</h3>
            </div>
            <div className="text-4xl opacity-80">📂</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Search */}
          <div className="flex-1 min-w-[280px] max-w-[400px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="min-w-[150px] flex-shrink-0">
            <select
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ 
                backgroundImage: "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')", 
                backgroundPosition: "right 0.5rem center", 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "1.2em 1.2em"
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="min-w-[140px] flex-shrink-0">
            <select
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer text-sm"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ 
                backgroundImage: "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')", 
                backgroundPosition: "right 0.5rem center", 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "1.2em 1.2em"
              }}
            >
              <option value="">All Languages</option>
              {languages.map((language, index) => (
                <option key={index} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="min-w-[140px] flex-shrink-0">
            <select
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer text-sm"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              style={{ 
                backgroundImage: "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')", 
                backgroundPosition: "right 0.5rem center", 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "1.2em 1.2em"
              }}
            >
              <option value="">All Books</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Out of Stock</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="min-w-[100px] flex-shrink-0">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-blue-600">{filteredBooks.length}</span> of <span className="font-medium">{books.length}</span> books
          </div>
          {filteredBooks.length !== books.length && (
            <div className="text-sm text-orange-600 font-medium">
              🔍 Filters applied
            </div>
          )}
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Books</h2>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Language</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Copies</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-20 bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md overflow-hidden flex-shrink-0">
                          {book.coverImage?.url ? (
                            <img
                              src={book.coverImage.url}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">📖</span>
                          )}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{book.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 mt-1">{book.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {book.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{book.language || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        <span className="font-semibold">{book.availableCopies}</span>
                        <span className="text-gray-500">/{book.totalCopies}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        book.availableCopies > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies > 0 ? '✅ Available' : '❌ Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/update-book/${book._id}`)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {books.length === 0 ? 'No books in library yet' : 'No books found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {books.length === 0
                ? 'Books will appear here once you add them to the library.'
                : 'Try adjusting your search terms or filters to find specific books.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;