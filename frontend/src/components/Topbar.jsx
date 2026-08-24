import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { AxiosInstance } from '../utils/AxiosInstance';
import { AppContext } from '../context/AppContext';

const Topbar = () => {
  const { loading, setLoading, setUser, navigate } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      const { data } = await AxiosInstance.post("/api/auth/logout");
      
      if (data.success) {
        toast.success(data.message || "Logged out successfully");
        setUser(null);
        navigate("/login");
      }
      
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '60px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'fixed',
      top: 0,
      left: 250, // sidebar width
      right: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#3498db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🏛️
        </div>
        <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Library Management System - Admin</h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#666' }}>Welcome, Admin</span>
        <button 
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          onClick={handleLogout}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Topbar;