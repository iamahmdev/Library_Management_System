import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    // Fetch student data when component loads
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // API call to fetch student by id
      const { AxiosInstance } = await import('../../utils/AxiosInstance');
      const { data } = await AxiosInstance.get(`/admin/students/${id}`);
      
      if (data.success && data.student) {
        setStudent({
          name: data.student.name || '',
          email: data.student.email || '',
          role: data.student.role || '',
          status: data.student.status || ''
        });
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Error loading student data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // API call to update student
      const { AxiosInstance } = await import('../../utils/AxiosInstance');
      const { data } = await AxiosInstance.put(`/admin/students/${id}`, student);
      
      if (data.success) {
        toast.success('Student updated successfully!');
        navigate('/admin/student-lists');
      } else {
        toast.error(data.message || 'Error updating student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error(error.response?.data?.message || 'Error updating student');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !student.name) {
    return <div>Loading student data...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Update Student</h1>
        <p style={{ color: '#666' }}>Edit student information below</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Student Name */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter email address"
            />
          </div>

          {/* Role */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Role *
            </label>
            <select
              name="role"
              value={student.role}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Status *
            </label>
            <select
              name="status"
              value={student.status}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '30px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={() => navigate('/admin/student-lists')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {loading ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;