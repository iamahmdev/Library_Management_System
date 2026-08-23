import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { AxiosInstance } from '../../utils/AxiosInstance';
import toast from 'react-hot-toast';

const UpdateBook = () => {
  const { id } = useParams();
  const { loading, setLoading, navigate } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'English',
    totalCopies: '',
    availableCopies: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
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

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { data } = await AxiosInstance.get(`/books/${id}`);
      if (data.success) {
        const book = data.book;
        setFormData({
          title: book.title,
          description: book.description,
          category: book.category,
          language: book.language,
          totalCopies: book.totalCopies,
          availableCopies: book.availableCopies
        });
        setCurrentImage(book.coverImage?.url || '');
      }
    } catch (error) {
      console.log('Error fetching book:', error);
      toast.error('Failed to fetch book details');
      navigate('/admin/book-list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

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
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.totalCopies) {
      toast.error('Please fill all required fields');
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
      bookFormData.append('availableCopies', formData.availableCopies);
      
      if (coverImage) {
        bookFormData.append('coverImage', coverImage);
      }

      const { data } = await AxiosInstance.put(`/books/${id}`, bookFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/admin/book-list');
        }, 1000);
      }

    } catch (error) {
      console.log('Error updating book:', error);
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Loading book details...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">✏️ Update Book</h1>
        <p className="text-gray-600">Update book information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Copies *
                  </label>
                  <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleInputChange}
                    placeholder="Total copies"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Copies
                  </label>
                  <input
                    type="number"
                    name="availableCopies"
                    value={formData.availableCopies}
                    onChange={handleInputChange}
                    placeholder="Available copies"
                    min="0"
                    max={formData.totalCopies}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image
              </label>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview || currentImage ? (
                    <div className="relative">
                      <img
                        src={imagePreview || currentImage}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg mx-auto"
                      />
                      {imagePreview && (
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
                      )}
                    </div>
                  ) : (
                    <div className="py-12">
                      <div className="text-6xl text-gray-400 mb-4">📖</div>
                      <p className="text-gray-600 mb-2">Click to upload new cover image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {currentImage && (
                  <p className="text-sm text-gray-500">Leave empty to keep current image</p>
                )}
              </div>
            </div>
          </div>

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
              {loading ? 'Updating...' : 'Update Book'}
            </button>
          </div>
        </form>
      </div>
      
      {categoryDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setCategoryDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default UpdateBook;