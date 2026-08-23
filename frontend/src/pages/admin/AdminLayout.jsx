import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: '250px', // sidebar width
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Topbar */}
        <Topbar />
        
        {/* Page Content */}
        <main style={{
          flex: 1,
          marginTop: '60px', // topbar height
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

export default AdminLayout;