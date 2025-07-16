import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MyAudits from './pages/listing/MyAudits';
import CancelOrder from './pages/order/CancelOrder';
import ReturnOrder from './pages/order/ReturnOrder';
import CancellationsAndReturns from './pages/order/CancellationsAndReturns';
import CustomerReturnsReduction from './pages/order/CustomerReturnsReduction';
import AddListingIndex from './pages/listing/addlisting/AddListingIndex';
import AddListingBulkIndex from './pages/listing/addbulklisting/AddListingBulkIndex';

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

// payment
const SettlementDashboard = lazy(() => import('./pages/payment/SettlementDashboard'));
const PaymentIndex = lazy(() => import('./pages/payment/PaymentIndex'));
const PreviousPayments = lazy(() => import('./pages/payment/PreviousPayments'));
const ReportCenter = lazy(() => import('./pages/payment/ReportCentre'));
const Statements = lazy(() => import('./pages/payment/Statements'));
const ServiceTransactions = lazy(() => import('./pages/payment/ServiceTransactions'));
// more
const MyServices = lazy(() => import('./pages/more/MyServices'));
const PartnerServicesHelp = lazy(() => import('./pages/more/PartnerServicesHelp'));



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
        <Route path="/add-single-listing" element={<PrivateRoute><AddListingIndex /></PrivateRoute>} />
        <Route path="/add-bulk-listing" element={<PrivateRoute><AddListingBulkIndex /></PrivateRoute>} />




        <Route path="/trackapprovalrequests" element={<PrivateRoute><ApprovalRequests /></PrivateRoute>} />
        <Route path="/myaudits" element={<PrivateRoute><MyAudits /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><InventoryIndex /></PrivateRoute>} />
        <Route path="/warehouse" element={<PrivateRoute><WarehouseOnboarding /></PrivateRoute>} />
        <Route path="/cancel-order" element={<PrivateRoute><CancelOrder /></PrivateRoute>} />
        <Route path="/return-order" element={<PrivateRoute><ReturnOrder /></PrivateRoute>} />
        <Route path="/returncancellogistic" element={<PrivateRoute><CancellationsAndReturns /></PrivateRoute>} />
        <Route path="/customer-return-reduction" element={<PrivateRoute><CustomerReturnsReduction /></PrivateRoute>} />

        <Route path="/warehouse" element={<PrivateRoute><WarehouseOnboarding /></PrivateRoute>} />

        {/* payment */}
        <Route path="/payments-overview" element={<PrivateRoute><PaymentIndex /></PrivateRoute>} />
        <Route path="/settlement-dashboard" element={<PrivateRoute><SettlementDashboard /></PrivateRoute>} />
        <Route path="/previous-payment" element={<PrivateRoute><PreviousPayments /></PrivateRoute>} />
        <Route path="/report-center" element={<PrivateRoute><ReportCenter /></PrivateRoute>} />
        <Route path="/statements" element={<PrivateRoute><Statements /></PrivateRoute>} />
        <Route path="/service-transaction" element={<PrivateRoute><ServiceTransactions /></PrivateRoute>} />

        {/* more */}
        <Route path="/my-service" element={<PrivateRoute><MyServices /></PrivateRoute>} />
        <Route path="/help" element={<PrivateRoute><PartnerServicesHelp /></PrivateRoute>} />




        {/* order */}
        <Route path="/activeorder" element={<PrivateRoute><ActiveOrder /></PrivateRoute>} />
        <Route path="/fbf-order" element={<PrivateRoute><FbfOrder /></PrivateRoute>} />



        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
