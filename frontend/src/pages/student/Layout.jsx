import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Topbar from '../../components/Topbar';

const Layout = () => {
  const location = useLocation();

  const menuItemStyle = (isActive) => ({
    display: 'block',
    padding: '12px 20px',
    textDecoration: 'none',
    color: isActive ? '#fff' : '#bdc3c7',
    backgroundColor: isActive ? '#34495e' : 'transparent',
    borderLeft: isActive ? '4px solid #3498db' : '4px solid transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  });
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sample Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        padding: '20px 0'
      }}>
        {/* Sample Logo */}
        <div style={{
          padding: '0 20px 20px',
          borderBottom: '1px solid #34495e',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3498db', margin: '0 0 5px 0' }}>📚 Student Panel</h3>
          <p style={{ color: '#7f8c8d', fontSize: '12px', margin: 0 }}>Library Management</p>
        </div>
        
        {/* Sample Menu Items */}
        <nav style={{ marginTop: '20px' }}>
          <Link 
            to="/student/dashboard" 
            style={menuItemStyle(location.pathname === '/student/dashboard' || location.pathname === '/student')}
          >
            🎯 Dashboard
          </Link>
          <Link 
            to="/student/books" 
            style={menuItemStyle(location.pathname === '/student/books')}
          >
            📚 Books  
          </Link>
          <Link 
            to="/student/my-books" 
            style={menuItemStyle(location.pathname === '/student/my-books')}
          >
            📖 My Books
          </Link>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: '250px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Admin Topbar - Reused for Student */}
        <Topbar />
        
        {/* Page Content */}
        <main style={{
          flex: 1,
          marginTop: '60px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          minHeight: 'calc(100vh - 60px)'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;