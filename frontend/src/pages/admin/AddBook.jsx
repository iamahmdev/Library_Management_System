import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { AxiosInstance } from '../../utils/AxiosInstance';
import toast from 'react-hot-toast';

const AddBook = () => {
  const { loading, setLoading, navigate } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'English',
    totalCopies: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories = [
    'Fiction',
    'Non-Fiction', 
    'Science',
    'Technology',
    'History',
    'Biography',
    'Romance',
    'Mystery',
    'Fantasy',
    'Education',
    'Self-Help',
    'Business'
  ];

  const languages = [
    'English',
    'Urdu',
    'Hindi',
    'Arabic',
    'French',
    'Spanish'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const selectCategory = (category) => {
    setFormData({
      ...formData,
      category: category
    });
    setCategoryDropdownOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.totalCopies) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!coverImage) {
      toast.error('Please select a cover image');
      return;
    }

    if (formData.totalCopies <= 0) {
      toast.error('Total copies must be greater than 0');
      return;
    }

    try {
      setLoading(true);

      const bookFormData = new FormData();
      bookFormData.append('title', formData.title);
      bookFormData.append('description', formData.description);
      bookFormData.append('category', formData.category);
      bookFormData.append('language', formData.language);
      bookFormData.append('totalCopies', formData.totalCopies);
      bookFormData.append('coverImage', coverImage);

      const { data } = await AxiosInstance.post('/books/add', bookFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success(data.message);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          language: 'English',
          totalCopies: ''
        });
        setCoverImage(null);
        setImagePreview(null);
        
        // Show success state with options
        setTimeout(() => {
          const addAnother = window.confirm('Book added successfully! Do you want to add another book?');
          if (addAnother) {
            // Stay on same page (form already reset)
            return;
          } else {
            // Navigate to book list
            navigate('/admin/book-list');
          }
        }, 1000);
      }

    } catch (error) {
      console.log('Error adding book:', error);
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">📚 Add New Book</h1>
        <p className="text-gray-600">Add a new book to your library collection</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category - Custom Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <div
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white flex justify-between items-center"
                >
                  <span className={formData.category ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.category || 'Select Category'}
                  </span>
                  <span className={`transform transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    <div
                      onClick={() => selectCategory('')}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 text-gray-500"
                    >
                      All Categories
                    </div>
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => selectCategory(category)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((language, index) => (
                    <option key={index} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              {/* Total Copies */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Copies *
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleInputChange}
                  placeholder="Enter number of copies"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter book description"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image *
              </label>
              
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setCoverImage(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="py-12">
                      <div className="text-6xl text-gray-400 mb-4">📖</div>
                      <p className="text-gray-600 mb-2">Click to upload cover image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/book-list')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Click outside to close dropdown */}
      {categoryDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setCategoryDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default AddBook;