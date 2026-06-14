import { Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/landing/Home';
import About from '../pages/landing/About';
import Services from '../pages/landing/Services';
import Packages from '../pages/landing/Packages';
import Gallery from '../pages/landing/Gallery';
import Contact from '../pages/landing/Contact';
import Login from '../pages/landing/Login';
import Register from '../pages/landing/Register';

import ClientDashboard from '../pages/client/Dashboard';
import MyBookings from '../pages/client/MyBookings';
import ClientPayments from '../pages/client/Payments';
import Messages from '../pages/client/Messages';
import Notifications from '../pages/client/Notifications';
import ClientCalendar from '../pages/client/Calendar';
import EventDetails from '../pages/client/EventDetails';
import Profile from '../pages/client/Profile';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminBookings from '../pages/admin/Bookings';
import AdminPayments from '../pages/admin/Payments';
import Clients from '../pages/admin/Clients';
import AdminPackages from '../pages/admin/Packages';
import AdminGallery from '../pages/admin/Gallery';
import AdminCalendar from '../pages/admin/Calendar';
import ContentManagement from '../pages/admin/ContentManagement';
import AdminReports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import InvitationTemplates from '../pages/admin/InvitationTemplates';
import AdminRsvpMonitoring from '../pages/admin/AdminRsvpMonitoring';

import InvitationView from '../pages/invitation/InvitationView';
import MyEvents from '../pages/client/MyEvents';
import InvitationBuilder from '../pages/client/InvitationBuilder';
import InvitationManage from '../pages/client/InvitationManage';
import GuestManagement from '../pages/client/GuestManagement';
import RSVPMonitoring from '../pages/client/RSVPMonitoring';

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Invitation Microsites */}
      <Route path="/invite/:slug" element={<InvitationView mode="slug" />} />
      <Route path="/event/:code" element={<InvitationView mode="code" />} />

      <Route
        path="/client"
        element={
          <ProtectedRoute role="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="payments" element={<ClientPayments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="calendar" element={<ClientCalendar />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="invitations" element={<MyEvents />} />
        <Route path="invitations/builder" element={<InvitationBuilder />} />
        <Route path="invitations/:id" element={<InvitationManage />} />
        <Route path="invitations/:id/guests" element={<GuestManagement />} />
        <Route path="invitations/:id/rsvp" element={<RSVPMonitoring />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="clients" element={<Clients />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="invitations" element={<InvitationTemplates />} />
        <Route path="rsvp" element={<AdminRsvpMonitoring />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
