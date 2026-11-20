import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHostels from './pages/admin/ManageHostels';
import ManageRooms from './pages/admin/ManageRooms';
import RoomAllocation from './pages/admin/RoomAllocation';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import ManageStudents from './pages/admin/ManageStudents';
import ReportsPage from './pages/admin/ReportsPage';
import AdminSettings from './pages/admin/AdminSettings';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyHostelPage from './pages/student/ApplyHostelPage';
import MyApplicationsPage from './pages/student/MyApplicationsPage';
import MyRoomPage from './pages/student/MyRoomPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Root Index Redirector based on user role
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="hostels" element={<ManageHostels />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="allocations" element={<RoomAllocation />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRole="STUDENT">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="apply" element={<ApplyHostelPage />} />
              <Route path="applications" element={<MyApplicationsPage />} />
              <Route path="my-room" element={<MyRoomPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
