import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SidebarOffcanvas from './components/SidebarOffcanvas';
import Header from './components/Header';
import AppRoutes from './AppRoutes';
import './assets/styles/main.css';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 991 });
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  if (isAuthPage) {
    return <AppRoutes />;
  }

  // Return full layout for protected pages
  return (
    <div className="app-layout">
      {/* Sidebar */}
      {!isTabletOrMobile && !collapsed && (
        <Sidebar collapsed={collapsed} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      {isTabletOrMobile && (
        <SidebarOffcanvas isOpen={sidebarOpen} toggle={toggleSidebar} />
      )}

      <div className={`main-wrapper flex-grow-1 ${collapsed ? 'sidebar-hidden' : ''}`}>
        <Header toggleSidebar={toggleSidebar} toggleCollapse={toggleCollapse} />
        <div className="content mt-3">
          <Container fluid >
            <AppRoutes />
          </Container>
        </div>
      </div>
    </div>
  );
}
