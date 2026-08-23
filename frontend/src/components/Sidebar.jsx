import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🎯' },
    { path: '/admin/add-book', label: 'Add Book', icon: '📝' },
    { path: '/admin/book-list', label: 'Book List', icon: '📚' },
    // { path: '/admin/add-student', label: 'Add Student', icon: '👤' },
    { path: '/admin/student-lists', label: 'Student Lists', icon: '📋' },
    { path: '/admin/book-borrowed', label: 'Books Borrowed', icon: '📤' },
    // { path: '/admin/book-returned', label: 'Books Returned', icon: '✅' },
    { path: '/admin/overdue-books', label: 'Overdue Books', icon: '🚨' },
    { path: '/admin/student-lists', label: 'Users', icon: '👥' },
  ];

  const sidebarStyle = {
    width: '250px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    color: 'white',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    zIndex: 999
  };

  const menuItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    textDecoration: 'none',
    color: isActive ? '#fff' : '#bdc3c7',
    backgroundColor: isActive ? '#34495e' : 'transparent',
    borderLeft: isActive ? '4px solid #3498db' : '4px solid transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  });

  return (
    <div style={sidebarStyle}>
      {/* Logo/Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #34495e',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#3498db',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          📚
        </div>
        <div>
          <h3 style={{ margin: 0, color: '#3498db', fontSize: '18px', fontWeight: 'bold' }}>Admin Panel</h3>
          <p style={{ margin: '2px 0 0 0', color: '#7f8c8d', fontSize: '12px' }}>Library Management</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{ paddingTop: '20px' }}>
        {menuItems.map((item, index) => (
          <Link
            key={`${item.path}-${index}`}
            to={item.path}
            style={menuItemStyle(location.pathname === item.path)}
            onMouseOver={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.backgroundColor = '#34495e';
                e.target.style.color = '#fff';
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#bdc3c7';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;