import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MyAudits from './pages/listing/MyAudits';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WidgetsGeneral = lazy(() => import('./pages/WidgetsGeneral'));
const ListingIndex = lazy(() => import('./pages/listing/ListingIndex'));
const ProfileIndex = lazy(() => import('./pages/profile/ProfileIndex'));
const AddListingProduct = lazy(() => import('./pages/listing/AddListingProduct'));
const ApprovalRequests = lazy(() => import('./pages/listing/ApprovalRequests'));
const InventoryIndex = lazy(() => import('./pages/inventory/InventoryIndex'));
const WarehouseOnboarding = lazy(() => import('./pages/inventory/WarehouseOnboarding'));
// order
const ActiveOrder = lazy(() => import('./pages/order/ActiveOrders'));
const FbfOrder = lazy(() => import('./pages/order/FbfOrder'));




const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Otp'));

// Dummy auth check
const isAuthenticated = () => !!localStorage.getItem('token');

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes inside layout */}
        <Route
          path="/" element={<PrivateRoute> <Dashboard /></PrivateRoute>
          }
        />
        <Route
          path="/widgets"
          element={
            <PrivateRoute>
              <WidgetsGeneral />
            </PrivateRoute>
          }
        />
        <Route
          path="/listing"
          element={
            <PrivateRoute>
              <ListingIndex />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileIndex />
            </PrivateRoute>
          }
        />
        <Route path="/addlisting" element={<PrivateRoute><AddListingProduct /></PrivateRoute>} />
        <Route path="/trackapprovalrequests" element={<PrivateRoute><ApprovalRequests /></PrivateRoute>} />
        <Route path="/myaudits" element={<PrivateRoute><MyAudits /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><InventoryIndex /></PrivateRoute>} />
        <Route path="/warehouse" element={<PrivateRoute><WarehouseOnboarding /></PrivateRoute>} />

        {/* order */}
        <Route path="/activeorder" element={<PrivateRoute><ActiveOrder /></PrivateRoute>} />
        <Route path="/fbf-order" element={<PrivateRoute><FbfOrder /></PrivateRoute>} />






        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
