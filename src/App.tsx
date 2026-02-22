import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataPulseLoader } from './components/common';

// Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentProfilePage from './pages/agent/AgentProfilePage';
import AgentIncidentDetailPage from './pages/agent/AgentIncidentDetailPage';

// Mobile Citizen Pages
import { ResponsiveLayout } from './components/navigation';
import HomeScreen from './pages/mobile/HomeScreen';
import { IncidentDetailScreen } from './pages/mobile/IncidentDetailScreen';
import { MyIncidentsScreen } from './pages/mobile/MyIncidentsScreen';
import { ReportWizard } from './pages/mobile/report-wizard/ReportWizard';
import { MapDashboard } from './pages/mobile/map/MapDashboard';

// Admin Layout & Pages
import { AdminLayout } from './components/admin/layout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllUsersPage from './pages/admin/users/AllUsersPage';
import PendingUsersPage from './pages/admin/PendingUsersPage';
import AllIncidentsPage from './pages/admin/incidents/AllIncidentsPage';
import IncidentDetailPage from './pages/admin/incidents/IncidentDetailPage';
import CategoriesPage from './pages/admin/categories/CategoriesPage';
import StatisticsPage from './pages/admin/statistics/StatisticsPage';
import { AgentLayout } from './components/agent/layout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false
}) => {
  const { isAuthenticated, isLoading, user, mustChangePassword } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECEFF1]">
        <DataPulseLoader size={60} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // CRITICAL: Force password change - block access to ALL protected routes
  if (mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace state={{ forced: true }} />;
  }

  if (adminOnly && user?.role !== 'ROLE_ADMIN' && user?.role !== 'ROLE_SUPERVISOR') {
    // Redirect non-admins to mobile home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

// Public Route (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, mustChangePassword, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECEFF1]">
        <DataPulseLoader size={60} />
      </div>
    );
  }

  // If authenticated but must change password, redirect to change password
  if (isAuthenticated && mustChangePassword) {
    return <Navigate to="/change-password" replace state={{ forced: true }} />;
  }

  // If authenticated and no password change needed, go to appropriate dashboard
  if (isAuthenticated && !mustChangePassword) {
    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPERVISOR';
    const isAgent = user?.role === 'ROLE_AGENT';
    const target = isAdmin ? '/admin/dashboard' : isAgent ? '/agent/dashboard' : '/home';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

// Change Password Route Guard - requires auth but allows access
const ChangePasswordRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECEFF1]">
        <DataPulseLoader size={60} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={
        <PublicRoute><RegisterPage /></PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />

      {/* Password Change - special route that requires auth but skips mustChangePassword check */}
      <Route path="/change-password" element={
        <ChangePasswordRoute><ChangePasswordPage /></ChangePasswordRoute>
      } />

      {/* Mobile Citizen Routes (ROLE_USER) - with ResponsiveLayout */}
      <Route path="/home" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <HomeScreen />
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      <Route path="/my-incidents" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <MyIncidentsScreen />
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      <Route path="/incidents/:id" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <IncidentDetailScreen />
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      <Route path="/map" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <MapDashboard />
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      <Route path="/report" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <ReportWizard />
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      <Route path="/mine" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold">My Incidents</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      {/* Agent Routes - with AgentLayout */}
      <Route path="/agent" element={
        <ProtectedRoute>
          <AgentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/agent/dashboard" replace />} />
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="profile" element={<AgentProfilePage />} />
        <Route path="incidents/:id" element={<AgentIncidentDetailPage />} />
      </Route>

      {/* User Dashboard (non-admin) - Legacy, kept for backward compatibility */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />

      {/* Profile Page - Accessible by all authenticated users */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ResponsiveLayout>
            <ProfilePage />
          </ResponsiveLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes - with AdminLayout */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* User Management */}
        <Route path="users" element={<Navigate to="/admin/users/all" replace />} />
        <Route path="users/all" element={<AllUsersPage />} />
        <Route path="users/pending" element={<PendingUsersPage />} />

        {/* Incident Management */}
        <Route path="incidents" element={<Navigate to="/admin/incidents/all" replace />} />
        <Route path="incidents/all" element={<AllIncidentsPage />} />
        <Route path="incidents/:id" element={<IncidentDetailPage />} />

        {/* Categories */}
        <Route path="categories" element={<CategoriesPage />} />

        {/* Statistics */}
        <Route path="statistics" element={<StatisticsPage />} />

        {/* Settings - placeholder */}
        <Route path="settings" element={
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-[#263238]">Settings</h2>
            <p className="text-[#546E7A]">Coming soon...</p>
          </div>
        } />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
