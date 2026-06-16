import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';

import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';

import ClientDashboard from '../pages/client/Dashboard';
import InvitationManage from '../pages/client/InvitationManage';
import InvitationBuilder from '../pages/client/InvitationBuilder';
import RSVPMonitoring from '../pages/client/RSVPMonitoring';
import ClientSettings from '../pages/client/Settings';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminRsvpMonitoring from '../pages/admin/AdminRsvpMonitoring';
import AdminCalendar from '../pages/admin/Calendar';
import InvitationTemplates from '../pages/admin/InvitationTemplates';
import AdminReports from '../pages/admin/Reports';
import AdminGallery from '../pages/admin/Gallery';
import AdminSettings from '../pages/admin/Settings';

import PublicInvitation from '../pages/invitation/PublicInvitation';

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/invitation/:slug" element={<PublicInvitation />} />
      <Route path="/invite/:slug" element={<PublicInvitation />} />

      <Route
        path="/client"
        element={
          <ProtectedRoute role="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="invitation-manage" element={<InvitationManage />} />
        <Route path="invitation-manage/:id" element={<InvitationManage />} />
        <Route path="invitation-builder" element={<InvitationBuilder />} />
        <Route path="rsvp-monitoring" element={<RSVPMonitoring />} />
        <Route path="settings" element={<ClientSettings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="rsvp-monitoring" element={<AdminRsvpMonitoring />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="invitation-templates" element={<InvitationTemplates />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
